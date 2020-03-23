const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    business_name: {
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cac_ID: {
        type: String,
        // required: true
    },
    nin: {
        type: String,
        // required: true
    },
    bvn: {
        type: String
    }
})

module.exports = mongoose.model('employer', employerSchema);