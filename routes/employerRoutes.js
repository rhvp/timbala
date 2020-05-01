const express = require('express'); 
const router = express.Router();
const employer = require('../controllers/employerController');
const auth = require('../config/authorization');



router.post('/signup', employer.sign_Up)

router.post('/login', employer.login)

router.post('/passwordforget', employer.forgot_Password)

router.get('/resetPassword/:token', employer.reset_Password)

router.use(auth.employerAuth);

router.route('/profile/:id')
    .get()
    .post()

router.get('/get_employee/:employee_id', employer.get_Employee_Profile) 
router.post('/shortlist_employee/:job_id', employer.shortlist_Employee)
router.get('/search/:searchQuery', employer.getEmployeesBySkill)
module.exports = router;