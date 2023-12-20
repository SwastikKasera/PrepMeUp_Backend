const UserModel = require('../models/UserModel')
const bcrypt = require('bcrypt')

const RegisterUser = async (req,res) =>{
    const {username, phoneNumber, email, password} = req.body
    try {
        if(!username || !phoneNumber || !email || !password){
            return res.status(400).json({
                message: "Fill all fields"
            })
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const registeredUser = await UserModel.create({username,phoneNumber, email, password:hashedPassword})
        if(!registeredUser){
            return res.status(401).json({
                message: "User fail to register"
            })
        }
        res.status(200).json({
            message:"User registered Successful"
        })
    } catch (error) {
        return res.status(500).json({
            message:"Error occur while register",
            error: error
        })
    }
}

module.exports = RegisterUser