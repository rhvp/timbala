const express = require('express');
const cors = require('cors');
const employer_routes = require('./routes/employerRoutes')
const AppError = require('./config/apperror');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());

app.use(cors());
app.options('*', cors());
app.use('/employer', employer_routes);

app.use((req, res, next)=>{
    let err = new AppError(`The requested resource ${req.originalUrl} is currently not on this server`, 404);
    next(err)
})
app.use(globalErrorHandler);
module.exports = app