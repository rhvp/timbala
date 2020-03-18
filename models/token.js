const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'employer'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 7200
    }
})

module.exports = mongoose.model('token', tokenSchema);