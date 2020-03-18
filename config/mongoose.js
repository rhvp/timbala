const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).then(()=>{
    console.log('MongoDB connected');
}).catch(err=>{
    console.error('Error connecting to MongoDB');
})

module.exports = mongoose.connection;