const multer=require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public')
  },
  filename: function (req, file, cb) {
   
    cb(null, file.originalname)
  }
})

module.exports.upload = multer({ storage,limits:{fileSize:1*1000*1000} })