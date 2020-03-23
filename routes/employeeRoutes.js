const express = require('express');
const employee = require('../controllers/employeeController')
const router = express.Router();

router.route('/signup')
    .post(employee.sign_Up)

router.route('/login')
    .post(employee.login)

module.exports = router;