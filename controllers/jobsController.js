const Job = require('../models/jobs');

module.exports = {
    createJob: async(req, res, next)=>{
        try{
            const job = await Job.create(req.body);
            res.status(201).json({
                status: 'success',
                message: 'Job created',
                data: {job}
            })
        } catch(err){
            next(err)
        }
    },

    getJobs: async(req, res, next)=>{
        const jobs = await Job.find({});
        res.status(200).json({
            status: 'success',
            data: {jobs}
        })
    },

    getJob: async(req, res, next)=>{
        const job = await Job.findById(req.params.job_id);
        res.status(200).json({
            status: 'success',
            data: {job}
        })
    }
}