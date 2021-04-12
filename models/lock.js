const mongoose = require('mongoose')

const lockScheme = new mongoose.Schema({
    lockTitle: {
        type: String,
        required: true
    },
    lockId: {
        type: String,
        required: true
    } 
    }
)

module.exports = mongoose.model('Lock', lockScheme)