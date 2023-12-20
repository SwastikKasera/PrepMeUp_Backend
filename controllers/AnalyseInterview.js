const ConversationModel = require("../models/ConversationModel");
const axios = require("axios");
const AnalyseModel = require("../models/AnalyseInterview");

const AnalyseInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const { userid } = req.userDetail;

    const fetchAnalysedInterview = await AnalyseModel.findOne({ interviewId });
    console.log("Analysed interview", fetchAnalysedInterview);
    if (fetchAnalysedInterview) {
      return res.status(200).json({
        message: "Analysis fetched from db",
        info: fetchAnalysedInterview,
      });
    } else {
      const fetchConversation = await ConversationModel.findOne({
        _id: interviewId,
      });

      if (!fetchConversation) {
        res.status(404).json({
          message: "Conversation not found",
        });
      }

      fetchConversation.conversation.shift();
      const convArray = fetchConversation.conversation;
      const prompt = `You are an Interviewer, I am providing an array on interview conversation, and you have analyse that converstation and give score each parameter, out of 10. The Array on conversation is ${convArray}
      Is the user answer is fluent?, is user answer gramatically correct?, is the answer of user is relevent to the question? is user have technical knowledge? is user solve some problem by using his project cames under problem solving ability. Rate his project on the basis of what problem is addressed and uniqueness. Do not force yourself give good score, if you think the interview was bad or left in between, give low scores.One this more, if the conversation is left in-between, give the score between 3 to 5. At the end give total overall score and one tip to improve.
      Note you only have to return json with this format:
      {
          speakingFluency:
          grammar:
          accuracyInAnswer:
          projectRating:
          problemSolvingAbility:
          totalScore:
          tips:

      }`;

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
          previous_history: [],
          temperature: 0.0,
          max_tokens: 2000,
        },
      };

      try {
        const response = await axios.request(options);
        const analysedJson = JSON.parse(response.data.openai.generated_text);

        const {
          speakingFluency,
          grammar,
          accuracyInAnswer,
          technicalKnowledge,
          projectRating,
          problemSolvingAbility,
          totalScore,
          tips,
        } = analysedJson;

        const savedAnalysis = await AnalyseModel.create({
          interviewId,
          speakingFluency,
          grammar,
          accuracyInAnswer,
          technicalKnowledge,
          problemSolvingAbility,
          projectRating,
          totalScore,
          tips,
        });

        console.log("Analysis saved successfully", savedAnalysis);
        res.status(200).json({
          info: analysedJson,
          message: "API hit successful",
        });
      } catch (error) {
        console.error("Error in API request:", error);
        res.status(500).json({
          message: "Internal Server Error api hit ke baad",
          error: error
        });
      }
    }
  } catch (error) {
    console.error("Error in AnalyseInterview:", error);
    res.status(500).json({
      message: "Internal Server Error main wala",
    });
  }
};

module.exports = AnalyseInterview;
