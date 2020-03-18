require('dotenv').config();
const app = require('./app');
const mongoose = require('./config/mongoose');


const port = process.env.PORT || 3100;
app.listen(port,()=>{
    console.log('App listening on port:' + port);
});