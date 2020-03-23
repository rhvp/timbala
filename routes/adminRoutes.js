const express = require('express');
const router = express.Router();
const adminAuth = require('../config/authorization');
const admin = require('../controllers/adminController')

router.route('/')
        .get(adminAuth,admin.hello_admin);

module.exports = router;