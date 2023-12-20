const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = async (req,res,next) =>{
    try {
    const token = req.headers.authorization

    if(!token){
        return res.status(400).json({
            message: "Token not found"
        })
    }
        const decodedToken = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
        req.userDetail = decodedToken
        next()
    } catch (error) {
        res.status(403).json({
            message: "Unauthorized",
            "error":error
        })
    }
}

module.exports = auth