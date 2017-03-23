const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/bidapp')
mongoose.connection.once('open', function() { console.log('connected to database') })
mongoose.connection.on('error', function(error) { console.log('Error: ' + error) })

const userSchema = new mongoose.Schema({
    //name: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}//,
    // email: {type: String, required: true},
    // dateCreated: Date.now,
    // phone: {type: String, required: true}
})

const User = mongoose.model('user', userSchema)

module.exports = { User }