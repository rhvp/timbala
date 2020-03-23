const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('role', roleSchema);