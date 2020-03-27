const mongoose = require('mongoose');

const hireSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        reuired: true
    },

    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employer',
        required: true
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

    candidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employee'
        }
    ]
})

module.exports = mongoose.model('hire', hireSchema);