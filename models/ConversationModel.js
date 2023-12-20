const mongoose = require('mongoose')
  
const ConversationSchema = mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    jobTitle:{
      type: String,
    },
    conversation:[{
      role: {
        type: String,
      },
      message: {
        type: String,
      },
    }]
})

module.exports = mongoose.model('Conversation', ConversationSchema)