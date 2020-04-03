const mongoose = require('mongoose');
const professionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
});

module.exports = mongoose.model('profession', professionSchema);