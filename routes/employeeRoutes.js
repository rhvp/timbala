const express = require('express');
const employee = require('../controllers/employeeController')
const router = express.Router();

router.route('/signup')
    .post(employee.sign_Up)

router.route('/login')
    .post(employee.login)

router.route('/passwordforget')
    .post(employee.forgot_Password)

router.route('/resetPassword/:token')
    .get(employee.reset_Password)

module.exports = router;