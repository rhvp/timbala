const express = require('express');
const employee = require('../controllers/employeeController')
const router = express.Router();
const auth = require('../config/authorization');

router.post('/signup', employee.sign_Up)

router.post('/login', employee.login)

router.post('/passwordforget', employee.forgot_Password)

router.get('/resetPassword/:token', employee.reset_Password)

router.use(auth.employeeAuth)


module.exports = router;