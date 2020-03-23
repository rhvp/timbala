module.exports = {
    hello_admin: (req, res, next)=>{
        res.status(200).json({
            status: 'success',
            message: 'admin route accessed'
        })
    }
}