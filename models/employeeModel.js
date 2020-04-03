const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profession',
        required: true
    },
    skills: {
        type: String
    },
    experience:{
        type: String
    },
    location: {
        type: String
    },
    jobsApplied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobs'
        }
    ]
})

module.exports = mongoose.model('employee', employeeSchema);