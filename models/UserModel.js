const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type:String,
    },
    password:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)