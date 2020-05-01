const express = require('express');
const router = express.Router();
const auth = require('../config/authorization');
const admin = require('../controllers/adminController');

router.use(auth.adminAuth);
router.get('/', admin.hello_admin)

router.get('/get_employers',admin.get_employers)

router.get('/get_workers', admin.get_employees)
        

module.exports = router;