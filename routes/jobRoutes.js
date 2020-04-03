const express = require('express'); 
const router = express.Router();
const job = require('../controllers/jobController');
const auth = require('../config/authorization');

router.route('/my_jobs/:id')
    .all(auth.employerAuth)
    .post(job.createJob)
    .get(job.getEmployerOpenJobs)

router.get('/my_jobs/:id/:job_id', auth.employerAuth, job.getEmployerSingleJob)

router.get('/open', job.get_open_jobs)

router.post('/apply/:employee_id/:job_id',auth.employeeAuth, job.apply_for_job)

module.exports = router;