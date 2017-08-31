/*
  
  This initial section will try to explain how im working with mongoose and promises, if you already get that then move on.

  We required bluebird in the model.js file which allows us to use mongoose promises that dependency could be moved here though

  Here is a quick example

  Say we have a model called Todo
  It's mongoose schema is something like this:

    const todoSchema = new mongoose.Schema({
      todo: {type: String, required: true},
      username: {type: String, required: true},
      dataCreated: {type: Date, default: Date.now}
    })

    const Todo = mongoose.model('todo', todoSchema)

  Let's make a todo:

    const item = {
      todo: "Clean up desktop",
      username: "messyUs3r"
    }

    const newTodo = new Todo(item)
    newTodo.save()

  Nice! we did it, that was easy. We didn't use promises though.

  Let's say we now want to try to search for all of a user's todos, this is one way we might do that:

    Todo.find({username: "messyUs3r"}, function(err, todos) {
      console.log(todos)
    })

  That is about as simple as it gets, but it still doesn't use promises for anything (and honestly wouldn't benefit from them anyways). Here it is with promise though anyways.

    Todo.find({username: "messyUs3r"}).exec()
    //now .exec() will actually return a promise, so we can use promise notation
    .then((todos) => {
      console.log(todos)
    })
    //so far so good, still quite simple looking
    //this notation will actually allow us to avoid nesting, let's close it off with error catching
    .catch((err) => {
      console.log(todos)
    })

  .catch() is pretty nice for catching errors and allowing the server to move on, although you can do that without promise if you want

  Let's say you wanted to do something weird once you had all of the user's todos
  Let's say we want to check if other users created a todo at the exact same time this user did,
  this will involve a callback and promises will make that work better

    Todo.find({username: "messyUs3r"}).exec()
    .then((todos) => {
      console.log(todos)
      date = todos[0].dateCreated
      return Todo.find({dateCreated: date})
    })
    .then((todos) => {
      //now we can console.log all of the todos that matched our user's todo's exact time...
      //there of course won't be any exact matches so it would end up returning the same todo we pulled the date from in the first place
      console.log(todos)
    })
    .catch((err) => {
      console.log(todos)
    })

  Alright well that is mongoose and promises in a nutshell
  Another thing to note, .save() also returns a promise like .exec()
  If you can see how all of the mongoose promises work together and see through my messy code then understanding
  individual parts won't be impossible. The lotsRequest part is pretty messy but most of the get and post requests
  are reasonably simple
  If you like promises, async/await is way better, it turns all of these callbacks and promises into synchronous looking code

*/

/*

  Another hard part of the server that is confusing is all of the dependencies and how they work together
  Most of them weren't important for me to fully understand although I'm sure knowing more would make things easier

*/

//fs http and https were added specifically to allow us to use secure https.
//fs to allow file reading to read the key and certificate
//I'm not sure if http is really needed but it was shown along side https in the SO responses I saw

const fs = require('fs')
const http = require('http')
const https = require('https')

//express is a framework that makes it easy to develop node apps
const express = require('express')

//rp and fetch are used exclusively in fetchAllLots so that we can use promises and make the newark api request in parallel
const rp = require('request-promise')
const fetch = require('node-fetch')

//body parser https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
const bodyParser = require('body-parser')

//jwt passport and passportJWT are things we need for working with logged in users
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

//bcrypt is simply used to salt and hash passwords so when they are sent to the database we aren't storing their real values
const bcrypt = require('bcryptjs')

//cronJob runs every 3rd hour to check if there is any new data from the newark api, we don't need this to run every 3rd hour, but the api can generally handle it okay
const CronJob = require('cron').CronJob

//looking in the model.js file we can see the schemas used to build these models. User is very simple, abandoned lot is very simple
//the bid schema stores the username and lotID with it so that you can search the model for a specific user's bids or you can search a specific
//lotID to see all the bids that have been placed on it.
//Favorite is similar to bid except it just contains the username and lotID (you can also delete favorites)
const { User, AbandonedLot, Bid, Favorite } = require('./models.js')

//jwt set up
let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()

//this secret key should be pulled from a file, not stored in server.js (from what I understand)
jwtOptions.secretOrKey = 'tasmanianDevil'

//this is the jwt 'strategy' used to verify users via jwt every time they make some request that requires them to be logged in
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  //console.log('payload received', jwt_payload)

  //User is the mongoose model so this is searching for users by id
  User.findById(jwt_payload.id, (err, user) => {

    //I think this next function passes the user on to wherever the 'passport.authenticate' was called (in one of the CRUD requests)
    //or it passes false if the user wasn't found
    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  })
})

passport.use(strategy)

//setting up express
const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

const privateKey  = fs.readFileSync('/etc/nginx/ssl/server.key', 'utf8')
const certificate = fs.readFileSync('/etc/nginx/ssl/server.crt', 'utf8')

const credentials = {key: privateKey, cert: certificate}

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

//httpServer.listen(8080)
httpsServer.listen(80)

//allows frontend to access all files in the public folder
app.use(express.static('public'))

//global Lots array filled with lots for sending to user via /map URL
Lots = []

//global time for front to see if they have the most up to date version of lot data
LotUpdateTime = 0

//javascript doesn't have its own range function
const range = (lo, hi) => Array.from({ length: hi - lo }, (_, i) => lo + i)

//in between url_front and url_back will be a number 0-however many vacant lots newark says they have (that is what 'offset' is)
//lots are requested in blocks of 100 so for newark there are around 2300 lots so ~23 requests will be made
//first offset will be 0 and it will increment by 100 all the way to offset=2400
const url_front = 'http://data.ci.newark.nj.us/api/action/datastore_search?offset='
const url_back = '&resource_id=796e2a01-d459-4574-9a48-23805fe0c3e0'

//Use the newark api to load the most recent abandoned properties and save them to database.
//set up request to newark

const fetchAllLots = async () => {
  try {

    console.log('requesting data from newark api')

    //get the total record count so that the full request can be made in parallel
    //await rp is async/await notation
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
    if (lots.length === 0 || lots.some(set => set === undefined)) {
      console.log('newark api error, no action taken')
    } else {

      //lots come in in arrays of 100 so we have to flatten them
      console.log('successful request')
      const records = lots.reduce((allLotsList,lotList) => allLotsList.concat(lotList.result.records),[])

      //filter out lots without Long or Lat
      const usable_records = records.filter(record => record.Longitude && record.Latitude)

      //gather lots from database to compare to latest newark data
      AbandonedLot.find({}).exec()
      .then(lots => {

        let newLots = usable_records

        //if lots.length is 0, mongoose model 'AbandonedLot' is empty and all lots will be new
        if (lots.length !== 0) {

          //otherwise filter to see which lots are new
          let hash = {}
          lots.forEach(lot => {
            hash[lot['lotID']] = true
          })

          newLots = usable_records.filter(lot => {
            return hash[lot['Longitude'] + '' + lot['Latitude']] === undefined
          })
        }

        console.log(newLots.length + ' new lots being added')

        const promises = newLots.map(record => {

          const item = {
            lotID: record['Longitude'] + '' + record['Latitude'],
            longitude: Number(record['Longitude']),
            latitude: Number(record['Latitude']),
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

          const newLot = new AbandonedLot(item)
          return newLot.save()
        })

        return Promise.all(promises)
      })
      .then((lots) => {

        console.log('successfully updated database')
        //reset global lots array
        if (lots.length > 0) {
          Lots = []
        }

      })
      .catch(err => {
        console.log(err)
      })
    }
  })
  .catch(err => {
    console.log(err, 'newark api completely overloaded')
  })
}

// AbandonedLot.remove({}, (err, data) => {})
// User.remove({}, (err, data) => {})
// Bid.remove({}, (err, data) => {})
// lotsRequest()


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
AbandonedLot.count({}, (err, c) => {
  if (c === 0) {
    lotsRequest()
  }
})


app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html')
})

//send time of last lot data update to front
app.get('/date', (req, res) => {
  res.status(200).json(LotUpdateTime)
})

//send lot data to front
app.get('/map',  (req, res) => {

  //if global Lots array isn't empty then no need to do another find, just send it
  if (Lots.length === 0) {

    AbandonedLot.find({}).exec()
    .then(lots => {

      if (lots) {
        //'Lots' holds what will be sent to the front end, I decided to delete the _id and __v so they aren't sent
        //_id is useless more or less so it avoids confusion
        //'lots' isn't a normal JS object so I had to do Object.create to convert it into one before i could delete the fields
        Lots = lots.map(lot => {
          let newLot = Object.create(lot)
          delete newLot['__v']
          delete newLot['_id']
          return newLot
        })
        LotUpdateTime = Date.now()

        res.status(200).json(Lots)
      } else {
        res.status(500).json('no lot data available')
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json('error executing find of lots')
    })
  } else {
    res.status(200).json(Lots)
  }
})

//simple route to check if user is logged in or not
app.get('/loginstatus', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({loggedIn: true, username: req.user.username})
})

//sends the front all user info
app.get('/userinfo', passport.authenticate('jwt', { session: false }), (req, res) => {
  const user = req.user

  //declare favorites here so it can be used in all of the '.then's
  let favorites = null
  //grab all of user's favs
  Favorite.find({username: req.user.username}).exec()
  .then(favs => {
    favorites = favs
    //now grab all of user's bids
    return Bid.find({username: req.user.username}).exec()
  })
  .then(bids => {

    //if bids or favs are empty it doesn't matter, can still send it to the front as is
    const userInfo = {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      bids: bids,
      favorites: favorites
    }

    res.status(200).json(userInfo)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json('error executing find on favorites/bids')
  })

})

//adding id to end of url makes this nice for a get request, front is asking for avg bid on a lot
app.get('/avgbid/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

  //check if lotID exists
  Bid.find({lotID: req.params.id}).exec()
  .then(bids => {
    if (bids.length === 0) {
      res.status(200).json({bids: 0, avg: null})
    } else {
      //userHash is used as a simple way to check whether I've already encountered a user yet when going through bids
      //we only want to average out all of the last bids made of each user who has bid on said lot
      userHash = {}

      const uniqueUserBids = bids.slice().sort((a,b) => b.bidDate - a.bidDate)
      .filter(bid => userHash[bid.username] === undefined ? userHash[bid.username] = true : false)

      const avg = uniqueUserBids.reduce((total, bid) => total + bid.amount, 0) / uniqueUserBids.length
      res.status(200).json({bids: uniqueUserBids.length, avg: avg})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json('error executing find on bids')
  })

})

app.post('/register', (req, res) => {
  //probably don't need this email regex, we may want more regulations on what a valid username or password is though
  let validEmail = req.body.email ? (/^[^@]+@[^@]+\.[a-z]{2,25}/).test(req.body.email) : false
  if (req.body.firstname && req.body.lastname && req.body.username && req.body.password && validEmail && req.body.phone) {

    let item = {
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        phone : req.body.phone
      }

      //confirm username doesn't already exist
      User.findOne({ username: req.body.username }, 'username', (err, user) => {
        if (err) {
          console.log(err)
          res.status(500).json({message:err})
        } else if (user) {
          res.status(401).json({message:'username already in use'})
        } else {

          const salt = bcrypt.genSaltSync(10)
          //item.password will now hold the hashed and salted password so that it can be safely stored in the database
          item.password = bcrypt.hashSync(item.password, salt)

          const user = new User(item)
          user.save()
          res.status(201).json({message:'success'})
        }
      })
  } else {
    res.status(401).json({message:'incomplete registration information'})
  }
})

app.post('/login', (req, res) => {
  if(req.body.username && req.body.password){
    const username = req.body.username
    const password = req.body.password

    //confirm username exists
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log(err)
      } else if (user) {

        //compare if password entered by user matches what is stored in the database
        if (bcrypt.compareSync(password, user.password)) {

          //jwt is created and the payload is associated with it so that when front sends jwt to server the user._id can be used
          //to find the user in the database
          const payload = {id: user._id}
          const token = jwt.sign(payload, jwtOptions.secretOrKey)
          res.status(200).json({message: 'ok', token: token})

        } else {
          res.status(401).json({message:'passwords did not match'})
        }
      } else {
        res.status(401).json({message:'username not found'})
      }
    })
  } else {
    res.status(401).json({message:'incomplete login information'})
  }
})

//user is making a bid
app.post('/bid', passport.authenticate('jwt', { session: false }), (req, res) => {

  //is bid amount valid?
  if (isNaN(req.body.bid)) {
    res.status(400).json({message: 'invalid bid amount'})
  } else {

    //is lotID valid?
    AbandonedLot.findOne({lotID: req.body.lotID}).exec()
    .then(lot => {

      //throw specific error so below in 'catch' can send error to front saying what went wrong
      if (lot === null) {throw 'lotID not found'}

        let item = {
          lotID: req.body.lotID,
          amount: Number(req.body.bid),
          username:req.user.username
        }
        const lotBid = new Bid(item)

        return lotBid.save()
    })
    .then(() => {
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
  }
})

app.post('/favorite', passport.authenticate('jwt', { session: false }), (req, res) => {

    //check if lot already exists as a favorite of user
    Favorite.find({username: req.user.username}).exec()
    .then(favs => {

      if (favs.find(fav => fav.lotID === req.body.lotID) !== undefined) {
        throw 'already a favorite'
      }

      //is lotID valid?
      return AbandonedLot.findOne({lotID: req.body.lotID}).exec()
    })
    .then(lot => {

      if (lot === null) {throw 'lotID not found'}

        let item = {
          lotID: req.body.lotID,
          username:req.user.username
        }
        const fav = new Favorite(item)

        return fav.save()
    })
    .then(() => {
        res.status(201).json({message: 'favorite saved'})
    })
    .catch(err => {

      console.log(err)
      if (err === 'lotID not found') {
        res.status(403).json({message: 'lotID not found'})
      } else if (err === 'already a favorite') {
        res.status(403).json({message: 'can\'t favorite a lot twice'})
      } else {
        res.status(500).json({message: 'failed to save, try again'})
      }

    })
})

//currently the only delete route, we probably don't want to delete information from the database unless it is non vital information like if a property was favorited. Even this information should probably be preserved in some way in the future
app.delete('/favorite/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  //check if lot exists as a favorite of user
    Favorite.find({username: req.user.username}).exec()
    .then(favs => {
      const fav = favs.find(fav => fav.lotID === req.params.id)
      if (fav === undefined) {
        throw 'can\'t delete, not a favorite'
      }

      Favorite.remove({'_id': fav}).exec()
    })
    .then(() => {
        res.status(204).json({message: 'successfully removed'})
    })
    .catch(err => {

      console.log(err)
      if (err === 'can\'t delete, not a favorite') {
        res.status(403).json({message: 'can\'t favorite a lot twice'})
      } else {
        res.status(500).json({message: 'failed to save, try again'})
      }

    })
})

//don't need if using HTTPS
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log('Listening on port ' + port)
// })
