const mongoose = require('mongoose')

const fingerprintScheme = new mongoose.Schema({
    isFingerprintCorrect: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Fingerprint', fingerprintScheme)