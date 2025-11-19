const axios = require("axios");
const FormData = require("form-data");
const ApiResponse = require("../utils/apiresponse");


const uploadFile = async (req, res) => {
   try {
     const file = req.file;
     // console.log("Received file:", file.originalname);   
 
     const formData = new FormData();
 
     formData.append("file", file.buffer, {
         filename: file.originalname,
         contentType: file.mimetype
     });
 
     const response = await axios.post(
         `${process.env.PYTHON_URL}/upload`,
         formData,
         { headers: formData.getHeaders() }
     );
     // console.log(response.data);
 
     const { topicId } = response.data;
 
     return res.status(201).json(new ApiResponse(true, { topicId },"File uploaded successfully", 201));
   } catch (error) {
     return res.status(500).json(new ApiResponse(false, { error: error.message }, "File upload failed", 500));
   }
};

const chat = async (req, res) => {
    try {
        const { topicId, question } = req.body;
        // console.log("Received question:", question);
    
    
        // Call Python backend
        const response = await axios.post(`${process.env.PYTHON_URL}/chat`, { topicId, question });
        const { answer, image } = response.data;
        // console.log("Received answer:", answer);
    
    
        res.status(200).json(new ApiResponse(true,  { answer, image }, "Chat response received", 200));
    } catch (error) {
        res.status(500).json(new ApiResponse(false, { error: error.message }, "Error processing chat request", 500));
    }
};

const getImagesByTopicId = async (req, res) => {
    try {
        const { topicId } = req.params;
        
        const data = await axios.get(`${process.env.PYTHON_URL}/images/${topicId}`);
        // console.log(data);

        res.status(200).json(new ApiResponse(true,  { images: data ? JSON.parse(data) : [] }, "Images retrieved successfully", 200));
    } catch (error) {
        return res.status(500).json(new ApiResponse(false, { error: error.message }, "Error retrieving images", 500));
    }
};

module.exports = { uploadFile, chat, getImagesByTopicId };
