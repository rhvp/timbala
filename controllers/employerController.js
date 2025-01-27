const Employer = require('../models/employerModel');
const Employee = require('../models/employeeModel');
const Token = require('../models/token');
const Role = require('../models/roles');
const Job = require('../models/jobs');
const AppError = require('../config/apperror');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const _ = require("underscore");

module.exports = {
    sign_Up: async(req, res, next)=> {
        try{
            const employee = await Employee.findOne({email: req.body.email});
            const user = await Employer.findOne({email: req.body.email})
            if(user || employee){
                return next(new AppError('A user is already registered with this email', 403));
            }
            const hashed_password = bcrypt.hashSync(req.body.password, 12);
            const role = await Role.findOne({name: 'employer'});
            const role_id = role._id;
            let expected_body = _.pick(req.body,['name','phone','email','password']);
            expected_body.password = hashed_password;
            expected_body.role = role_id;
            const newUser = new Employer(expected_body);
            newUser.save(err=>{
                if(err){
                    return next(new AppError(err.message, 500));
                }
                console.log(newUser);
                newUser.password = undefined;
                res.status(201).json({
                    status: 'success',
                    message: 'User successfully signed up',
                    data: newUser
                })
            })
        } catch(err){
            next(err)
        }
    },


    login: async(req, res, next)=>{
        try{
            const user = await Employer.findOne({email: req.body.email}).populate('role');
            if(!user){
                return next(new AppError('User with provided email does not exist', 404))
            }
            const correctPassword = bcrypt.compareSync(req.body.password, user.password);
            if(correctPassword){
                const token = jwt.sign({user}, process.env.JWT_SECRET);
                await Token.create({user_ID: user._id, token: token});
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + 60 * 60 * 5
                    ),
                    httpOnly: true
                };
                if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
                res.cookie('jwt', token, cookieOptions);
                user.password = undefined

                res.status(200).json({
                    status: 'success',
                    message: 'User successfully logged in',
                    data: user
                })
            } else {
                return next(new AppError(`Incorrect Email/Password`, 401))
            }
        } catch(err){
            next(err)
        }
    },

    forgot_Password: async(req, res, next)=>{
        try{
            const user = await Employer.findOne({email: req.body.email});
            if(!user){
                return next(new AppError('No user registered with this email was found', 404))
            }
            const $email = req.body.email
            const token = crypto.randomBytes(16).toString('hex');
            const newToken = new Token({user_ID: user._id, token: token});
            newToken.save(err=>{
                if(err){next(new AppError(err.message, 500))}
                const url = `${req.protocol}://${req.get("host")}/employer/resetPassword/${token}`;
                console.log($email)
                sendEmail({
                    from: 'Timbala no-reply@timbala.com',
                    email: $email,
                    replyTo: 'Timbala no-reply@timbala.com',
                    subject: 'Password Reset',
                    message: `<p>Follow this link to reset your password: ${url}</p>`
                }).then(()=>{
                    res.status(200).json({
                        status: 'success',
                        message: 'Password reset link sent to user email'
                    })
                }).catch(err=>{
                    return next(new AppError(err.message, 500))
                })
            })
            
        } catch(err){
            next(err)
        }
    },

    reset_Password: async(req, res, next)=>{
       const token = await Token.findOne({token: req.params.token});
       if(!token){
           return next(new AppError('token validation error. You may be using an expired token', 401))
       }
       const id = token.user_ID
       const user = await Employer.findById(id);
       if(user){
           res.status(200).json({
               status: 'success',
               message: 'redirecting to password-change page..'
           })
       } else{
           return next(new AppError('Error resetting password', 500));
       }
    },

    get_Employee_Profile: async(req, res, next)=>{
        const employee = await Employee.findById(req.params.employee_id);
        if(!employee) return next(new AppError('Requested employee does not exist', 404));
        employee.password = undefined;
        res.status(200).json({
            status: 'success',
            data: {employee}
        })
    },

    shortlist_Employee: async(req, res, next)=>{
        try {
            let employee_id = req.body.employee_id;
            const job = await Job.findById(req.params.job_id);
            if(!job) return next(new AppError('Requested job no longer exists', 404));

            // Check if employee is already shortlisted
            const isInArray = job.shortlist.some(doc=>doc.equals(employee_id));
            if(isInArray) return next(new AppError('Employee has already been shortlisted', 403));

            const id = mongoose.Types.ObjectId(employee_id);
            await Job.updateOne({'_id': req.params.job_id}, {'$push':{'shortlist': id}});
            res.status(200).json({
                status: 'success',
                message: 'Employee successfully shortlisted'
            })
        } catch (error) {
            next(error)
        }
    },

    getEmployeesBySkill: async(req,res,next)=>{
        try {
            const response = await Employee.find({$text:{$search: req.params.searchQuery}}).limit(20);
            res.status(200).json({
                status: 'success',
                data: {response}
            })
        } catch (error) {
            next()
        }
    }
}