const jwt = require('jsonwebtoken');
const AppError = require('./apperror');
const Token = require('../models/token');



module.exports = {
    adminAuth: async(req, res, next)=> {
        let auth = req.headers['authorization'];
        try{
            let token = await Token.findOne({token: auth});
            if(!auth || !token)  return next(new AppError('Access denied. Invalid or expired token', 403));
            const authorized = jwt.verify(auth, process.env.JWT_SECRET);
            if(authorized.user.role.name === 'admin') {
                next()
            } else{
                return next(new AppError('User is unauthorized to access this route.', 403));
            }
        } catch(err){
            next(err)
        }
    },
    employerAuth: async (req, res, next)=>{
        let auth = req.headers['authorization'];
        try{
            let token = await Token.findOne({token: auth});
            if(!auth || !token) return next(new AppError('Access denied. Invalid or expired token', 403));
            const authorized = jwt.verify(auth, process.env.JWT_SECRET);
            if(authorized.user.role.name === 'employer') {
                next()
            } else{
                return next(new AppError('User is unauthorized to access this route', 403));
            }
        } catch(err){
            next(err)
        }
    },

    employeeAuth: async(req, res, next)=>{
        let auth = req.headers['authorization'];
        try{
            let token = await Token.findOne({token: auth});
            if(!auth || !token) return next(new AppError('Access denied. Invalid or expired token', 403));
            const authorized = jwt.verify(auth, process.env.JWT_SECRET);
            if(authorized.user.role.name === 'basic'){
                next()
            } else{
                return next(new AppError('User is unauthorized to access this route', 403));
            }
        } catch(err){
            next(err)
        }
    }
}