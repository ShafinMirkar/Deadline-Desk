const { constants } = require("../constants");

const customError = (err,req,res,next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({
                title: "Validation error",
                message: err.message,
                stack: err.stack
            })
            break;
        case constants.UNAUTHORIZED:
            res.json({
                title: "Unautorized user error",
                message: err.message,
                stack: err.stack
            })
            break;
        case constants.FORBIDDEN:
            res.json({
                title: "Forbidden access",
                message: err.message,
                stack: err.stack
            })
            break;
        case constants.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stack: err.stack
            })
            break;
    
        default:
            break;
    }
    next() 
}
module.exports = customError