const jwt = require('jsonwebtoken');
const AppError = require('./apperror');


module.exports = (req, res, next)=>{
    let auth = req.headers['authorization'];
    if(!auth) return new AppError('Access denied. No token provided.')
    try{
        const authorized = jwt.verify(auth, process.env.JWT_SECRET);
        console.log(authorized);
        if(authorized.user.role.name === 'admin') {
            next()
        } else{
            return next(new AppError('User is unauthorized to access this route', 403));
        }
    } catch(err){
        next(err)
    }
}