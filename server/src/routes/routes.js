const express=require('express')
const uploadController = require('../controllers/controller.js')
const router=express.Router()
const multer  = require('multer')
const upload = multer()

router.post('/uploadFile',upload.single('file'),uploadController.uploadFile)
router.post('/chat',uploadController.chat)
router.get("/images/:topicId", uploadController.getImagesByTopicId);

module.exports=router