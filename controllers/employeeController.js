const Employee = require('../models/employeeModel');
const Employer = require('../models/employerModel');
const AppError = require('../config/apperror');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/nodemailer');
const crypto = require('crypto');
const Token = require('../models/token');

module.exports = {
    sign_Up: async(req, res, next)=>{
        try{
            const employer = await Employer.findOne({email:req.body.email});
            const user = await Employee.findOne({email:req.body.email});
            if(user || employer) return next(new AppError('A user is already registered with this email', 403));
            const hashedPassword = bcrypt.hashSync(req.body.password, 12);
            const newUser = new Employee({
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword
            })

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
            const user = await Employee.findOne({email:req.body.email});
            if(!user)return next(new AppError('User with provided email does not exist', 404));
            const correctPassword = bcrypt.compareSync(req.body.password, user.password);
            if(correctPassword){
                const id = user._id;
                const token = jwt.sign({id}, process.env.JWT_SECRET);
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
        
    }
}