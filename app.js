const express = require('express');
const bodyparser = require('body-parser');
const musicRoutes = require('./app/routes/music.routes');
const authRoutes = require('./app/routes/auth.routes');
const userRoutes = require('./app/routes/user.routes');
const path = require('path');
const app = express();


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Manage CORS problem because frontend and backend do not share the same environment.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// body-parser extracts the entire body part of an incoming request stream and exposes it on req.body.
app.use(bodyparser.json());


const db = require("./app/models");
const Role = db.role;

db.mongoose.connect('mongodb+srv://ayoub:anee2018@musy.5kllz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((err, req, res,next) => {
  if(err.code === "LIMIT_FILE_SIZE") {
    res.status(422).send({ error :'Allowed file size is 500kb'});
    return;
  }
  if(err.code === "INCORRECT_FILETYPE") {
    res.status(422).send({ error :'Only images are allowed'});
    return;
  }
})



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Musy application." });
});


app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use('/musics', express.static(path.join(__dirname, 'uploads')));
app.use('/api/music', musicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

module.exports = app;
