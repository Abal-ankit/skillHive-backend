const jwt = require("jsonwebtoken");
require("dotenv").config();

const optionVerifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        // console.log(req.headers);
    
        const token = authHeader && authHeader.split(" ")[1];
    
        if(!token)
            return next();
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        if(!decoded)
            return next();
    
        req.user = decoded;
        next();
    } catch (error) {
        error.location = "optionalVerifyToken Middleware";
        next(error);
    }
}

module.exports = optionVerifyToken;
