const mongoose = require("mongoose");

const analyseInterviewSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  speakingFluency: {
    type: String,
  },
  grammar: {
    type: String,
  },
  accuracyInAnswer: {
    type: String,
  },
  technicalKnowledge: {
    type: String,
  },
  projectRating: {
    type: String,
  },
  problemSolvingAbility: {
    type: String,
  },
  totalScore: {
    type: String,
  },
  tips: {
    type: String,
  },
});

module.exports = mongoose.model("Analysis", analyseInterviewSchema);
