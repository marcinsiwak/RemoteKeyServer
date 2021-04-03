const mongoose = require('mongoose')

const patternScheme = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    pattern: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Pattern', patternScheme)