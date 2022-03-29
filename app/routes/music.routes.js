const { authJwt } = require("../middlewares");
const multer = require('../middlewares/multer-config');
const musicCtrl = require('../controllers/music.controller');
const express = require('express');
const router = express.Router();

// Cors config

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});



router.post('/upload', [authJwt.verifyToken], multer, musicCtrl.createMusicDynamic);

// create a music whithout a file
router.post('/', [authJwt.verifyToken], musicCtrl.createMusic);

//  recovery of all music 
router.get('/', [authJwt.verifyToken], musicCtrl.getAllMusic
);

// get one music
router.get('/:id', [authJwt.verifyToken], musicCtrl.getOneMusic
);
 
// updating of a music already posted
router.put('/:id', [authJwt.verifyToken],
  musicCtrl.modifyMusic
);

// updating of a music and upload already posted
router.put('/upload/:id', [authJwt.verifyToken], multer,
  musicCtrl.modifyMusicDynamic
);

// delete music already posted
router.delete('/:id', [authJwt.verifyToken], 
  musicCtrl.deleteMusic
);

// delete music and uploads already posted
router.delete('/upload/:id', [authJwt.verifyToken], 
  musicCtrl.deleteMusicDynamic
);

module.exports = router;