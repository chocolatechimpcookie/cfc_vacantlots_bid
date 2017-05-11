const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

mongoose.connect('mongodb://localhost/bidapp')
mongoose.connection.once('open', function() { console.log('connected to database') })
mongoose.connection.on('error', function(error) { console.log('Error: ' + error) })

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now, required: true},
    phone: {type: String, required: true}
})

const bidSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    address: {type: String, required: true},
    bidDate: {type: Date, default: Date.now, required: true}
    //bidID
    //username
})

const abandonedLotSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    vitalStreetName: {type: String, required: true},
    vitalHouseNumber: {type: String, required: true},
    ownerName: {type: String, required: false},
    ownerAddress: {type: String, required: false},
    classDesc: {type: String, required: false},
    zipcode: {type: Number, required: false},
    netValue: {type: Number, required: false},
    lot: {type: String, required: false},
    block: {type: String, required: false},
    cityState: {type: String, required: false}
})


const User = mongoose.model('user', userSchema)
const Bid = mongoose.model('bid', bidSchema)
const AbandonedLot = mongoose.model('abandonedLot', abandonedLotSchema)

module.exports = { User, Bid, AbandonedLot }