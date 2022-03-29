const Music = require('../models/music.model');
const fs = require('fs');

// to get all the music from the database
exports.getAllMusic = (req, res, next) => {
    Music.find().then(
      (musics) => {
        res.status(200).json(musics);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

// to get only one music by the id
exports.getOneMusic = (req, res, next) => {
  Music.findOne({
    _id: req.params.id
  }).then(
    (music) => {
      res.status(200).json(music);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};


// create a music and save it in the database
// this function works if the music and the cover are links and will not be saved on the localstorage
exports.createMusic = (req, res, next) => {
  const music = new Music({
    name:  req.body.name,
    description: req.body.description,
    cover:  req.body.cover,
    userId: req.body.userId,
    artist: req.body.artist,
    source: req.body.source,
    url: req.body.url,
    favorited: req.body.favorited,
    numberLikes: req.body.numberLikes,
    numberStreams: req.body.numberStreams,
  });
  music.save().then(
    () => {
      res.status(201).json({
        message: 'Music saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// create a music and save it in the database
// this function works if the music and the cover are files and they will be saved on the localstorage
exports.createMusicDynamic = (req, res) => {
  // the source and cover files are saved in this request you can test by puting the comment below
  //console.log(req.files.file[0].filename);
  //console.log(req.files.source[0].filename);

  /*
  console.log(req.body.description);
  console.log(req.body.url);
  console.log(req.body.userId);
  console.log(req.body.favorited);
  console.log(req.body.artist)
  */
  
  const music = new Music({
    name:  req.body.name,
    description: req.body.description,
    cover: `${req.protocol}://${req.get('host')}/images/${req.files.file[0].filename}`,
    userId: req.body.userId,
    artist: req.body.artist,
    source: `${req.protocol}://${req.get('host')}/musics/${req.files.source[0].filename}`,
    url: req.body.url,
    favorited: req.body.favorited,
    numberLikes: req.body.numberLikes,
    numberStreams: req.body.numberStreams,
  });
  // to see the music that will be saved in the data base
  // console.log(music)
  music.save()
  // let's send to the client the result
  .then(() => res.status(201).json({ message: 'Objet enregistré !', file: req.files.file, source:req.files.source}))
  .catch(error => res.status(400).json({ error }));
}





// to modify all what we what for a music whit cover and source saved by link 
exports.modifyMusic = (req, res, next) => {
  console.log("THE SERVER IS USING MODIFY MUSIC")
  const music = new Music({
    _id: req.params.id,
    name:  req.body.name,
    description: req.body.description,
    cover:  req.body.cover,
    userId: req.body.userId,
    artist: req.body.artist,
    source: req.body.source,
    url: req.body.url,
    favorited: req.body.favorited,
  });
  Music.updateOne({_id: req.params.id}, music).then(
    () => {
      res.status(201).json({
        message: 'Music updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


// to modify all what we what for a music whit cover and source saved in the localstorage 
exports.modifyMusicDynamic = (req, res, next) => {
  /*
  console.log("THE SERVER IS USING MODIFY MUSIC DYNAMIC")
  console.log(" req.body " + req.body.name)
  console.log(" req.body " + req.params.id)
  console.log(" req.body " + req.files.source[0].filename)
  const music = new Music({
    name:  req.body.name,
    description: req.body.description,
    cover: `${req.protocol}://${req.get('host')}/images/${req.files.file[0].filename}`,
    userId: req.body.userId,
    artist: req.body.artist,
    source: `${req.protocol}://${req.get('host')}/musics/${req.files.source[0].filename}`,
    url: req.body.url,
    favorited: req.body.favorited,
    numberLikes: req.body.numberLikes,
    numberStreams: req.body.numberStreams,
  });
  */
  const MusicObject = req.files ?
    {
      ...req.body,
      cover: `${req.protocol}://${req.get('host')}/images/${req.files.file[0].filename}`,
      source : `${req.protocol}://${req.get('host')}/musics/${req.files.source[0].filename}`,
    } : { ...req.body }; 
  Music.updateOne({ _id: req.params.id }, { ...MusicObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Music Updated successfully !'}))
    .catch(error => res.status(400).json({ error }));
};


// to delete a music
exports.deleteMusic = (req, res, next) => {
  Music.findOne({ _id: req.params.id }).then(
    (music) => {
      if (!music) {
        res.status(404).json({
          error: new Error('No such music!')
        });
      }
      // see the userID
      // console.log(req.userId)
      // Another artist or user can not delete the song if he did not creat it before
      if (music.userId !== req.userId) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      } else {
      Music.deleteOne({ _id: req.params.id }).then(
        () => {
          res.status(200).json({
            message: 'Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
      }
    }
  )
};

exports.deleteMusicDynamic = (req, res, next) => {
  Music.findOne({ _id: req.params.id })
    .then(music => {
      const filenameCover = music.cover.split('/images/')[1];
      const filenameSource = music.source.split('/musics/')[1];
      if (music.userId !== req.userId) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }else {
        fs.unlinkSync(`uploads/${filenameCover}`)
        console.log("the cover file has been deleted")
        fs.unlinkSync(`uploads/${filenameSource}`)
        console.log("the Source file has been deleted")
        
        Music.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      }
    })
  .catch(error => res.status(500).json({ error }));
};


