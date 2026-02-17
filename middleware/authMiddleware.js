const jwt = require('jsonwebtoken');
const authMiddleware = (req,res,next) => {
    const token = req.header("x-auth-token");

if(!token){
     return res.status(401).json({ message: "No token, authorization denied" });
}

try{
    const decoded = jwt.verify(token, "AapkaSecretKey");
        req.user = decoded; 
        next();
} catch(err) {
     res.status(401).json({ message: "Token is not valid" });
}
};

module.exports = authMiddleware;