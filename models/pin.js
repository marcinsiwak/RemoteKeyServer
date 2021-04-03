const mongoose = require('mongoose')

const pinScheme = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Pin', pinScheme)