const express = require('express')
const {AskOpenai, Conversation} = require('../controllers/Conversation')
const RegisterUser = require('../controllers/RegisterUser')
const LoginUser = require('../controllers/Login')
const auth = require('../auth/auth')
const {fetchAllInterview, fetchInterviewById} = require('../controllers/FetchConversation')
const AnalyseInterview = require('../controllers/AnalyseInterview')
const AppRouter = express.Router()

AppRouter.post('/register', RegisterUser)
AppRouter.post('/login', LoginUser)
AppRouter.post('/interview',auth, AskOpenai)
AppRouter.post('/interview/conversation',auth, Conversation)
AppRouter.get('/fetchinterview',auth, fetchAllInterview)
AppRouter.get('/fetchinterviewbyid/:interviewId',auth, fetchInterviewById)
AppRouter.post('/analyse', auth, AnalyseInterview)

module.exports = AppRouter