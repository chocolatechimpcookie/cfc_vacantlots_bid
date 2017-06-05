const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

mongoose.connect('mongodb://localhost/bidapp')
mongoose.connection.once('open', function() { console.log('connected to database') })
mongoose.connection.on('error', function(error) { console.log('Error: ' + error) })

const userSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now},
    phone: {type: String, required: true}
    //usertype: { type: String, required: true} //example, admin/standard
})

const bidSchema = new mongoose.Schema({
    lotID: {type: String, required: true},
    amount: {type: Number, required: true},
    bidDate: {type: Date, default: Date.now},
    username: {type: String, required: true}
})

const abandonedLotSchema = new mongoose.Schema({
    lotID: {type: String, required: true},
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    vitalStreetName: {type: String, required: true},
    vitalHouseNumber: {type: String, required: true},
    ownerName: {type: String, required: false},
    ownerAddress: {type: String, required: false},
    classDesc: {type: String, required: false},
    zipcode: {type: String, required: false},
    netValue: {type: String, required: false},
    lot: {type: String, required: false},
    block: {type: String, required: false},
    cityState: {type: String, required: false}
})

const User = mongoose.model('user', userSchema)
const Bid = mongoose.model('bid', bidSchema)
const AbandonedLot = mongoose.model('lotsWithBids', abandonedLotSchema)

module.exports = { User, Bid, AbandonedLot }