const mongoose = require('mongoose')

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    hasPin: {
        type: Boolean,
        default: false
    },
    hasFingerprint: {
        type: Boolean,
        default: false
    },
    hasPattern: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('User', userScheme)