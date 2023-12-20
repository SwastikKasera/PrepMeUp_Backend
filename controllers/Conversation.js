const axios = require('axios');
const ConversationModel = require('../models/ConversationModel');

let chatHistory = [];
let chatId = "";

const updateChatHistory = async (userid, jobTitle) => {
  try {
    const conversationData = { userid,jobTitle, conversation: chatHistory };
    if (chatId) {
      // If chatId exists, update the existing document
      await ConversationModel.findByIdAndUpdate(chatId, conversationData);
      console.log("working on audio api");
      
    } else {
      // If chatId doesn't exist, create a new document
      const savedConv = await ConversationModel.create(conversationData);
      chatId = savedConv._id;
      console.log("chat saved in the database");
      console.log("last msg", chatHistory[chatHistory.length - 1].message);
    }
  } catch (error) {
    console.error("Error updating chat history:", error);
  }
};


const AskOpenai = async (req, res) => {
  const { jobTitle } = req.body;
  const { userid } = req.userDetail;
  console.log("userDetails", userid);
  const prompt = `I am a ${jobTitle} and tomorrow is my interview for this job. I am skilled in my domain and want you to take my interview by asking only questions and analyze my answers. At the end, you have to tell me about my performance. You only have to ask a single question at a time to give me time to answer one by one. I want it to feel like a real interview. So, just ask one question, and after receiving the response, ask another one based on my response and job role. Avoid using bullet points, headings, subheadings. I want only questions because that distracts me. To make it more realistic, start with something like "Can you tell me a little bit about yourself and your expertise?" After I respond to this question, then deep dive into it. Do not say, "I can take your interview" as it seems unprofessional. Don't use this format "Question 1: "question here." Ignore this type of thing.`;

  // Define your 'options' object here
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/text/chat",
    headers: {
      authorization: `Bearer ${process.env.EDENAI_API}`,
    },
    data: {
      show_original_response: false,
      fallback_providers: "",
      providers: "openai",
      text: prompt,
      chatbot_global_action: "Act as an Expert Interviewer",
      previous_history: chatHistory,
      temperature: 0.0,
      max_tokens: 2000,
    },
  };

  try {
    const response = await axios.request(options);
    aiMessage = response.data.openai.message;
    chatHistory.push(...aiMessage);

    // Update chat history in the database
    await updateChatHistory(userid, jobTitle);
    const audioUrl = await getAudio(res)
    return res.status(201).json({
      "aimessage": aiMessage,
      "audioUrl": audioUrl
    })
    // console.log("chatHistory: ", chatHistory);
  } catch (error) {
    res.status(400).send({
      message: "Error in sending user speech",
    });
    console.error(error);
  }
};

const Conversation = async (req, res) => {
  const { userSpeech } = req.body;
  const { userid } = req.userDetail;

  // Define your 'options' object here
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/text/chat",
    headers: {
      authorization: `Bearer ${process.env.EDENAI_API}`,
    },
    data: {
      show_original_response: false,
      fallback_providers: "",
      providers: "openai",
      text: userSpeech,
      chatbot_global_action: "Act as an Expert Interviewer",
      previous_history: chatHistory,
      temperature: 0.0,
      max_tokens: 2000,
    }
  }
  try {
    const response = await axios.request(options);
    const aiMessage = response.data.openai.message;
    chatHistory.push(...aiMessage);

    // Update chat history in the database
    await updateChatHistory(userid);
    const audioUrl = await getAudio(res)
    return res.status(201).json({
      "aimessage": aiMessage,
      "audioUrl": audioUrl
    })
    // console.log("chat history", chatHistory);

  } catch (error) {
    console.error("audio ke baad ka error",error);
  }
};

const getAudio = async (res)=>{
  const audioOptions = {
    method: "POST",
    url: "https://api.edenai.run/v2/audio/text_to_speech",
    headers: {
      authorization: `Bearer ${process.env.EDENAI_API}`,
    },
    data: {
      show_original_response: false,
      fallback_providers: "",
      providers: "google",
      language: "en",
      text: chatHistory[chatHistory.length - 1].message,
      option: "FEMALE",
    },
  };

  const audioResp = await axios.request(audioOptions);
  if(audioResp){
    return audioResp.data.google.audio_resource_url
  }else{
    console.log("Audio Response not recieved");
  }
  console.log("audio resp", audioResp);
}

module.exports = { AskOpenai, Conversation };
