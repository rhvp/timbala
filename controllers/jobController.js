const Job = require('../models/jobs');
const Employee = require('../models/employeeModel');
const AppError = require('../config/apperror');
const mongoose = require('mongoose');

module.exports = {

    createJob: (req, res, next)=>{
        let expected_body = {profession:req.body.profession, employer: req.params.id}
        Job.create(expected_body).then(data=>{
            res.status(201).json({
                status: 'success',
                message: 'New job created'
            })
        }).catch(next)
    },

    getEmployerOpenJobs: async(req, res, next)=>{
        try {
            const jobs = await Job.find({employer: req.params.id, status: 'searching'}).populate('profession');
            if(!jobs) return next(new AppError('No open jobs found for this user.', 404))
            res.status(200).json({
                status: 'success',
                data: {jobs}
            })
        } catch (error) {
            next(error)
        }
    },

    getEmployerSingleJob: async(req, res, next)=>{
        try {
            const job = await Job.findOne({_id:req.params.job_id, employer: req.params.id}).populate('profession');
            if(!job) return next(new AppError('Job not found or no longer exists', 404));
            res.status(200).json({
                status: 'success',
                data: {job}
            })
        } catch (error) {
            next(error)
        }
    },

    get_open_jobs: async(req, res, next)=>{
        try {
            const jobs = await Job.find({status: 'searching'}).populate('profession');
            res.status(200).json({
                status: 'success',
                data: { jobs }
            })
        } catch (error) {
            next(error)
        }
    },

    apply_for_job: async(req, res, next)=>{
        try {
            const job = await Job.findById(req.params.job_id)
            const user = await Employee.findById(req.params.employee_id);
            if(!job) return next(new AppError('Requested job no longer exists', 404));
            const isInArray = user.jobsApplied.some(doc=>doc.equals(req.params.job_id));
            if(isInArray) return next(new AppError('User has already applied for this job', 401))
            const employee_id = mongoose.Types.ObjectId(req.params.employee_id);
            const job_id = mongoose.Types.ObjectId(req.params.job_id);
            await Job.updateOne({'_id': req.params.job_id}, {'$push': {'applicants': employee_id}});
            await Employee.updateOne({'_id': req.params.employee_id}, {'$push': {'jobsApplied': job_id}});
            res.status(200).json({
                status: 'success',
                message: 'successfully applied for job'
            })
        } catch (error) {
            next(error)
        }
    }
}