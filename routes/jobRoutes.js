const express = require('express'); 
const router = express.Router();
const jobController = require('../controllers/jobsController');
const auth = require('../config/authorization');


router.route('/get_jobs')
    .get(jobController.getJobs)

router.route('/get_job/:job_id')
    .get(jobController.getJob)

    
router.use(auth.adminAuth);
router.route('/create_job')
    .post(jobController.createJob)



module.exports = router