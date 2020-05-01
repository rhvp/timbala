const mongoose = require('mongoose');
const professionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
});

module.exports = mongoose.model('profession', professionSchema);