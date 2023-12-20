const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const LoginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        if (!phoneNumber || !password) {
            return res.status(400).json({
            message: "Fill all login credentials",
            });
        }
        const fetchedUser = await UserModel.findOne({ phoneNumber });
        if (!fetchedUser) {
            return res.status(402).json({
                message: "User not registered.",
            });
        }
        const decryptPassword = await bcrypt.compare(password, fetchedUser.password);
        if (!decryptPassword) {
            return res.status(401).json({
                message: "Wrong Password. Try again",
            });
        }
        const token = jwt.sign(
            {
                userid: fetchedUser._id,
                username: fetchedUser.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        console.log(token);
        return res.status(200).json({
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occur",
            error: error
        })
    }
};

module.exports = LoginUser