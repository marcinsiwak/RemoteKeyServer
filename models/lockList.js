const mongoose = require('mongoose')

const lockListScheme = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    lockList: {
        type: Array,
        required: true,
        'default': []
    } 
    }
)

module.exports = mongoose.model('LockList', lockListScheme)