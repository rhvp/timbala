const Employer = require('../models/employerModel');
const Employee = require('../models/employeeModel');


module.exports = {
    hello_admin: (req, res, next)=>{
        res.status(200).json({
            status: 'success',
            message: 'admin route accessed'
        })
    },

    get_employers: async(req, res, next)=>{
        try {
            const users = await Employer.find({});
            res.status(200).json({
                message: 'success',
                data: {users}
            })
        } catch (err) {
            next(err)
        }
    },

    get_employees: async(req, res, next)=>{
        try {
            const users = await Employee.find({});
            res.status(200).json({
                message: 'success',
                data: {users}
            })
        } catch (err) {
            next(err)
        }
    }
}