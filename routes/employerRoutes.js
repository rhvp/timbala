const express = require('express'); 
const router = express.Router();
const employerController = require('../controllers/employerController');

router.route('/signup')
    .post(employerController.sign_Up)

router.route('/login')
    .post(employerController.login)

router.route('/passwordforget')
    .post(employerController.forgot_Password)

router.route('/resetPassword/:token')
    .get(employerController.reset_Password)

module.exports = router;