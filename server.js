const express = require("express")
const _ = require("lodash")

const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')

const passport = require("passport")
const passportJWT = require("passport-jwt")

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const { User } = require("./models.js")


//in place of database for now
var users = [
  {
    id: 1,
    name: 'jonathan Hahn',
    username: 'jonathanmh',
    password: '%2yx4',
    email: 'jon@gmail.com',
    phone: '1234567890'
  },
  {
    id: 2,
    name: 'test test',
    username: 'test',
    password: 'test',
    email: 'test@test.com',
    phone: '1111111111'
  }
]

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader()
jwtOptions.secretOrKey = 'tasmanianDevil'

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload)
  // usually this would be a database call:
  var user = users[_.findIndex(users, {id: jwt_payload.id})]
  if (user) {
    next(null, user)
  } else {
    next(null, false)
  }
})

passport.use(strategy)

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('public'))

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + '/public/index.html')
})

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token")
})

app.get("/secretDebug",
  function(req, res, next){
    console.log(req.get('Authorization'))
    next()
  }, function(req, res){
    res.json("debugging")
})

app.post("/login", function(req, res) {
  if(req.body.username && req.body.password){
    var username = req.body.username
    var password = req.body.password
  }

  // usually this would be a database call:
  var user = users[_.findIndex(users, {username: username})]

  if( ! user ){
    res.status(401).json({message:"no such user found"})
  }

  if(user.password === password) {
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: user.id}
    var token = jwt.sign(payload, jwtOptions.secretOrKey)
    res.status(201).json({message: "ok", token: token})
  } else {
    res.status(401).json({message:"passwords did not match"})
  }
})

app.post("/register", function(req, res) {
  if (req.body.name && req.body.username && req.body.password && req.body.email && req.body.phone) {
    var name = req.body.name,
        username = req.body.username,
        password = req.body.password,
        email = req.body.email,
        phone = req.body.phone
  }
  
  var user = users[_.findIndex(users, {username: username})]

  if (!user) {
    users.push({id: users.length + 1, 
                name: name,
                username: username,
                password: password,
                email: email,
                phone: phone})
    res.status(201)
  } else {
    res.status(500).json({message:"username already in use"})
  }
})

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on port " + port)
})
