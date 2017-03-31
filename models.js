const mongoose = require('mongoose')

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

const User = mongoose.model('user', userSchema)
const Bid = mongoose.model('bid', bidSchema)

module.exports = { User, Bid }