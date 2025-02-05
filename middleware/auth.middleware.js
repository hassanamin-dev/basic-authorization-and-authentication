const jwt = require('jsonwebtoken')
const authMiddleware = async (req, res, next)=> {

    const authHeaders = req.headers['authorization']
    console.log(authHeaders)
    const token = authHeaders && authHeaders.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Access denied! No token providec. Please login to continue"
        })
    }

    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodeToken);

        req.info = decodeToken
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Access denied! No token provided. please login to continue"
        })
    }
}

module.exports = {authMiddleware}