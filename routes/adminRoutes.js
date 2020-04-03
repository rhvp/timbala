const express = require('express');
const router = express.Router();
const auth = require('../config/authorization');
const admin = require('../controllers/adminController');

router.use(auth.adminAuth);
router.route('/')
        .get(admin.hello_admin)

router.route('/get_employers')
        .get(admin.get_employers)

router.route('/get_workers')
        .get(admin.get_employees)

module.exports = router;