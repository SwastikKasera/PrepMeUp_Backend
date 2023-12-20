const ConversationModel = require('../models/ConversationModel')

const fetchAllInterview = async (req,res)=>{
    const {userid} = req.userDetail
    console.log(userid);
    
    try {
        const fetchInterview = await ConversationModel.find({userid})
        if(!fetchInterview){
            return res.status(404).json({
                message: "Interview not found"
            })
        }
        return res.status(200).json({
            message: "Interview Fetched Success",
            info: fetchInterview
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in fetching interview",
            error: error
        })
    }
}

const fetchInterviewById = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const resp = await ConversationModel.findById({ _id: interviewId });
        if (!resp) {
            return res.status(402).json({
                message: "Interview of the id does not exist",
            });
        }

        res.status(200).json({
            message: "Success, Interview id fetched",
            info: resp,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error in fetching interview of the id",
        });
    }
};

module.exports = {fetchAllInterview, fetchInterviewById}