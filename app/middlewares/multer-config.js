/* 
    Multer is a node. js middleware for handling multipart/form-data , 
    which is primarily used for uploading files.
    It is written on top of busboy for maximum efficiency. 
    NOTE: Multer will not process any form which is not multipart ( multipart/form-data ).
*/
const multer = require('multer');


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'audio/mp3': 'mp3', 
  'audio/mp4': 'mp4',
  'audio/mpeg': 'mpeg'
};


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "audio/mp3", "audio/mp4", "audio/mpeg"];
  if (!allowedTypes.includes(file.mimetype)){
    const error = new Error("Incorrect file type: " + file.mimetype);
    error.code = "INCORRECT_FILETYPE";
    // error occured
    return cb(error, false)
  }
  cb(null, true)
}


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads');
  },
  filename: (req, file, callback) => {
    let name = file.originalname.split('.')[0];
    name = name.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
  fileFilter,
  /*
  limits:{
    fileSize : 500000000000000000000000
  }
  */
});



module.exports = multer({storage: storage}).fields(
  [ { name:'file', maxCount: 1},{name: 'source', maxCount: 1}]);