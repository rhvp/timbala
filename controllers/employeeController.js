const Employee = require('../models/employeeModel');
const Employer = require('../models/employerModel');
const AppError = require('../config/apperror');
const Role = require('../models/roles');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/nodemailer');
const crypto = require('crypto');
const Token = require('../models/token');
const _ = require("underscore");
const Profession = require('../models/professions');
const Job = require('../models/jobs');
const mongoose = require('mongoose');

module.exports = {
    sign_Up: async(req, res, next)=>{
        try{
            const employer = await Employer.findOne({email:req.body.email});
            const user = await Employee.findOne({email:req.body.email});
            if(user || employer) return next(new AppError('A user is already registered with this email', 403));
            const hashedPassword = bcrypt.hashSync(req.body.password, 12);
            let expected_body = _.pick(req.body,['firstname','lastname','phone','email','password','profession','skills']);
            const role = Role.findOne({name: 'basic'});
            let role_id = role._id;
            expected_body.role = role_id;
            expected_body.password = hashedPassword;
            const newUser = new Employee(expected_body)
            
            newUser.save(err=>{
                if(err)return next(new AppError(err.message, 500));
                newUser.password = undefined;
                
                    res.status(201).json({
                        status: 'success',
                        message: 'User successfully created',
                        data: {newUser}
                    })
                
            })
        } catch(err){
            next(err)
        }
    },

    login: async(req, res, next)=>{
        try{
            const user = await Employee.findOne({email:req.body.email}).populate('role');
            if(!user)return next(new AppError('User with provided email does not exist', 404));
            const correctPassword = bcrypt.compareSync(req.body.password, user.password);
            if(correctPassword){
                const token = jwt.sign({user}, process.env.JWT_SECRET);
                await Token.create({user_ID: user._id, token: token});
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + 60 * 60 * 5
                    ),
                    httpOnly: true
                }
                if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
                res.cookie('jwt',token, cookieOptions);
                user.password = undefined;
                res.status(200).json({
                    status: 'success',
                    message: 'User successfully signed in',
                    data: {
                        user
                    }
                })
            } else{
                return next(new AppError('Incorrect Email/Password', 401));
            }
        } catch(err){
            next(err)
        }
    },

    forgot_Password: async(req, res, next)=>{
        try{
            const user = await Employee.findOne({email: req.body.email});
            if(!user){
                return next(new AppError('No user registered with this email was found', 404))
            }
            const $email = req.body.email
            const token = crypto.randomBytes(16).toString('hex');
            const newToken = new Token({user_ID: user._id, token: token});
            newToken.save(err=>{
                if(err){next(new AppError(err.message, 500))}
                const url = `${req.protocol}://${req.get("host")}/employee/resetPassword/${token}`;
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
           return next(new AppError('token validation error. You may be using an expired token', 403))
       }
       const id = token.user_ID
       const user = await Employee.findById(id);
       if(user){
           res.status(200).json({
               status: 'success',
               message: 'redirecting to password-change page..'
           })
       } else{
           return next(new AppError('Error resetting password', 500));
       }
    }
}