const express = require('express')
const rp = require('request-promise')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const bcrypt = require('bcryptjs')
const CronJob = require('cron').CronJob
const { User, Bid, AbandonedLot, LotWithBids } = require('./models.js')

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
jwtOptions.secretOrKey = 'tasmanianDevil'

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload)

  User.findById(jwt_payload.id, (err, user) => {
    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  })
})

passport.use(strategy)

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('public'))


const range = (lo, hi) => Array.from({ length: hi - lo }, (_, i) => lo + i)
const url_front = 'http://data.ci.newark.nj.us/api/action/datastore_search?offset='
const url_back = '&resource_id=796e2a01-d459-4574-9a48-23805fe0c3e0'

//Use the newark api to load the most recent abandoned properties and save them to database.
//set up request to newark

const fetchAllLots = async () => {
  try {
    console.log('requesting data from newark api')
    //get the total record count so that the full request can be made in parallel
    const lotBatchCount = parseInt(
      await rp(url_front + '0' + url_back).then(res => Math.ceil(JSON.parse(res).result.total/100)).catch(err => console.log(err))
    )
    //fetch urls
    const lotBatchPromises = range(0, lotBatchCount).map(offset =>
      fetch(url_front + offset * 100 + url_back).then(res => res.json()).catch(err => console.log(err))
    )
    console.log('starting request')
    const lotBatches = await Promise.all(lotBatchPromises)
    return lotBatches
  } catch (err) {
    console.log(`Error: ${err}`)
  }
}

//start a request to the newark api

const lotsRequest = () => {
  //execute the request
  fetchAllLots().then(lots => {
    if (lots.length === 0 || lots.some((set) => set === undefined)) {
      console.log('newark api error, no action taken')
    } else {

      console.log('successful request')
      const records = lots.reduce((allLotsList,lotList) => allLotsList.concat(lotList.result.records),[])

      //save lots to database AbandonedLot model
      lotPromises = records.filter(record => record.Longitude && record.Latitude).map(record => {

        return new Promise((resolve, reject) => {

          const item = {
            lotID: record.Longitude + '' + record.Latitude,
            longitude: Number(record.Longitude),
            latitude: Number(record.Latitude),
            vitalStreetName: record['Vital Street Name'],
            vitalHouseNumber: record['Vital House Number'],
            ownerName: record['Owner Name'],
            ownerAddress: record['Owner Address'],
            classDesc: record['Class Desc'],
            zipcode: record['Zipcode'],
            netValue: record['NetValue'],
            lot: record['Lot'],
            block: record['Block'],
            cityState: record['City, State']
          }

          const abandonedLot = new AbandonedLot(item)
          abandonedLot.save((err, result) => {
            if (err) {reject(err)}
            resolve(result)
          })

        })
      })

      Promise.all(lotPromises).then((results) => {
        console.log('updating lots in database')
        //now update lotsWithBids
        LotWithBids.find({}).exec((err, lots) => {

          const lotPromises = lot => {

            const item = {
              lotID: lot['lotID'],
              longitude: lot['longitude'],
              latitude: lot['latitude'],
              vitalStreetName: lot['vitalStreetName'],
              vitalHouseNumber: lot['vitalHouseNumber'],
              ownerName: lot['ownerName'],
              ownerAddress: lot['ownerAddress'],
              classDesc: lot['classDesc'],
              zipcode: lot['zipcode'],
              netValue: lot['netValue'],
              lot: lot['lot'],
              block: lot['block'],
              cityState: lot['cityState']
            }

            const newLot = new LotWithBids(item)
            return newLot.save()
          }
          if (lots.length === 0) {

            const promise = AbandonedLot.find({}).exec()
            promise.then(lots => {
              const promises = lots.map(lot => lotPromises(lot))
              Promise.all(promises).then(() => {
                console.log('successfully filled database')
              })
              .catch(err => {
                console.log(err)
              })
            })
            .catch(err => {
              console.log(err)
            })

          } else {
            AbandonedLot.find({}).exec()
            .then(lots => {
              LotWithBids.find({}).exec((err, lots_with_bids) => {
                let hash = {}
                lots_with_bids.forEach(lot => {
                  hash[lot['lotID']] = true
                })

                let newLots = lots.filter(lot => hash[lot['lotID']] === undefined)

                console.log(newLots.length + ' new lots being added')

                const promises = newLots.map(lot => lotPromises(lot))
                Promise.all(promises).then(() => {
                  console.log('successfully updated database')
                })
                .catch(err => {
                  console.log(err)
                })
              })

            })
            .catch(err => {
              console.log(err)
            })
            //check for new entries

          }
        }).catch(err => console.log(err))
      }, (error) => {
        console.log(error, 'saving failed')
      })
    }
  }).catch(err => console.log(err, 'newark api completely overloaded'))
}

// AbandonedLot.remove({}, (err, data) => {})
// LotWithBids.remove({}, (err, data) => {})
// User.remove({}, (err, data) => {})
// Bid.remove({}, (err, data) => {})
// lotsRequest()

// LotWithBids.findOne({lotID: '-74.1990760505640.73758226'}, (err, lots) => {
//   console.log(lots)
// })

//request lots from newark every 3 hrs
const job = new CronJob({
  cronTime: '0 */3 * * *',
  onTick: function() {
    lotsRequest()
  },
  start: false,
  timeZone: 'America/New_York'
})
job.start()

//if lots collection is empty at startup request lots immediately
AbandonedLot.count({},(err, c) => {
  if (c === 0) {
    lotsRequest()
  }
})



app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html')
})

app.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json('Success! You cannot see this without a token')
})

//send plain lot data to front
app.get('/map',  (req, res) => {
    AbandonedLot.find({}).exec()
    .then(lots => {
      if (lots) {
        res.status(200).json(lots)
      } else {
        res.status(403).json('unable to locate lotID in database')
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json('error executing find of lots')
    })
})

app.get('/loginstatus', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({loggedIn: true, username: req.user.username})
})

app.get('/avgbid/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  LotWithBids.findOne({lotID: req.params.id}).exec()
  .then(lot => {
    if (lot) {
      Bid.find({bidID: {$in: lot['bids']}}).exec()
      .then(bids => {
        if (bids.length === 0) {
          res.status(200).json({bids: 0, avg: null})
        } else {
          userHash = {}
          console.log(bids)
          const uniqueUserBids = bids.slice().sort((a,b) => b - a)
          .filter(bid => userHash[bid.username] === undefined ? userHash[bid.username] = true : false)
          const avg = uniqueUserBids.reduce((total, bid) => total + bid.amount, 0) / uniqueUserBids.length
          res.status(200).json({bids: uniqueUserBids.length, avg: avg})
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json('error executing find on bids')
      })
    } else {
      res.status(403).json('unable to locate lotID in database')
    }
  })
  .catch(err => {
    console.log(err)
    res.status(403).json('error executing findOne on lotID')
  })
})


const chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const rand = (size) => Math.floor(Math.random() * size)
const getID = (size) => Array.from({length: size}).reduce((id) => id + chars[rand(chars.length)], '')
const getIDlen15 = () => getID(15)

app.post('/bid', passport.authenticate('jwt', { session: false }), (req, res) => {
  bidID = getIDlen15()
  
  //if username is valid
  User.findOne({username: req.user.username}).exec().then(user => {
    if (user === null) {throw 'username not found'}

    const promise = LotWithBids.findOne({lotID: req.body.lotID}).exec()

    //and if lotID is valid
    const lotPromise = promise.then(lot => {
      if (lot === null) {throw 'lotID not found'}
      if (!isNaN(Number(req.body.lotID))) {throw 'bid amount invalid'}

        lot.bids = lot.bids.concat(bidID)
        updatedLot = new LotWithBids(lot)

        user.bids = user.bids.concat(bidID)
        updatedUser = new User(user)

        let item = {
          bidID: bidID,
          lotID: req.body.lotID,
          amount: Number(req.body.bid),
          username:req.user.username
        }
        const lotBid = new Bid(item)

        //then save the bidID in the user's bids, lot's bids, and save the new bid
        //if there is an error with user save or bid save there will be unwanted saved bidIDs in lot and or user model
        return Promise.all([updatedLot.save(), updatedUser.save(), lotBid.save()])
    })
    .then(product => {
        res.status(201).json({message: 'bid saved'})
    })
    .catch(err => {
      console.log(err)
      if (err === 'lotID not found') {
        res.status(403).json({message: 'lotID not found'})
      } else {
        res.status(500).json({message: 'failed to save, try again'})
      }
    })
  })
  .catch(err => {
    console.log(err)
    res.status(403).json({message: 'username not found'})
  })
})

app.post('/login', (req, res) => {
  if(req.body.username && req.body.password){
    const username = req.body.username
    const password = req.body.password

    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log(err)
      } else if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const payload = {id: user._id}
          const token = jwt.sign(payload, jwtOptions.secretOrKey)
          res.status(201).json({message: 'ok', token: token})
        } else {
          res.status(403).json({message:'passwords did not match'})
        }
      } else {
        res.status(403).json({message:'no such user found'})
      }
    })
  } else {
    res.status(403).json({message:'incomplete login information'})
  }
})

app.post('/register', (req, res) => {
  if (req.body.name && req.body.username && req.body.password && req.body.email && req.body.phone) {
    let item = {
        name : req.body.name,
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        phone : req.body.phone
        //check if dataCreated works/exists if you don't specify it here
      }
      User.findOne({ username: req.body.username }, 'username', (err, user) => {
        if (err) {
          console.log(err)
          res.status(500).json({message:err})
        } else if (user) {
          res.status(403).json({message:'username already in use'})
        } else {
          const salt = bcrypt.genSaltSync(10)

          item.password = bcrypt.hashSync(item.password, salt)
          const user = new User(item)
          user.save()
          res.status(201).json({message:'success'})
        }
      })
  } else {
    res.status(403).json({message:'incomplete registration information'})
  }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
