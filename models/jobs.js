const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    profession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profession',
        reuired: true
    },

    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employer',
        required: true
    },
    location: {
        type: String
    },
    status: {
        type: String,
        enum: ['searching', 'interviewing', 'hired'],
        default: 'searching'
    },

    hiredCandidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },

    shortlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employee'
        }
    ],

    applicants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employee'
        }
    ],

    type: {
        type: String,
        enum: ['contract', 'full-time']
    },

    terms: {
        pay:{
            type: String
        },

        benefits: {
            type: String
        }
    }
})

module.exports = mongoose.model('job', jobSchema);