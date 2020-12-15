// const mongo = require('mongodb').MongoClient
const mongo = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
// const mongodb = require('express-mongo-db')
const crypto = require('crypto')
const mongoUrl = 'mongodb+srv://farhanMaulana:Shermanjumbo123@cluster0.i8t2f.mongodb.net/FileSharingMateri?retryWrites=true&w=majority';
const path = require('path');
var gridfs = require('gridfs-stream');
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override')
var Binary = require('mongodb').Binary;
var fs = require('fs');

const passport = require('passport');
const { authenticate } = require('passport')
const LocalStrategy = require('passport-local').Strategy

// const file = require('./models/file.js');


const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(uploadController)

// var file_path = './test.txt';

// var connection = mongo.connect(mongoUrl, {
//     useNewUrlParser: true
//         }).then(() => {
//           console.log("Successfully connected to the database"); 
//         }).catch(err => {
//           console.log('Could not connect to the database. Exiting now...', err);
//         process.exit();
// });

// var conn = mongo.createConnection(mongoUrl);

var conn = mongo.createConnection(mongoUrl, function(err, db){
  if(err){ 
    console.log("Please check you db connection parameters");
  }else{
    console.log("Connection success");

    // here we are going to write code for file
  }
});
var fileSchema = conn.model('fileSchema', require('./models/file.js'));
var User = conn.model('User', require('./models/user.js'));





// Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif|docx|pptx|ppt|doc|pdf/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);
//   if(mimetype && extname){
//       return cb(null,true);
//     } else {
//       cb('File type not allowed!');
//     }
// }

//////////////////////////
///Storage and Stream/////
//////////////////////////


//init stream
conn.once('open', () => 
{
  gfs = Grid(conn.db, mongo.mongo);
  gfs.collection('files')

  // all set!
})

//init storage
const storage = new GridFsStorage({
  url: mongoUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'files'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage: storage });

const saltRounds = 10;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login');
}


//////////
//Routes//
//////////




app.get('/', (req,res) => {
    res.redirect('/home');
});


app.get('/user/myfiles', (req,res) => {
  var data = "testOfFile"
  res.render('myfiles', {data: data});
});


app.get('/user/profile', (req,res) => {
  res.render('profile');
});


app.get('/materi', (req,res) => {
  res.render('materi');
});

app.get('/register', (req,res) => {
  res.render('register');
});

app.get('/user/upload', (req,res) =>{
  res.render('upload')
})

app.get('/home', (req,res) =>{
  res.render('home')
})

app.post('/user/upload', upload.single('fileNameforUpload'), (req,res,next) => {
      //res.json({error_code:0,err_desc:null});
      global.originalname = req.file.filename
      var fileName = req.body.filename
      var dbFilename = originalname
      var fileDesc = req.body.filedescription
      var namaUser = "TestUser"
      //res.redirect('/fileMeta')
      fileSchema({filename: fileName,
                  desc: fileDesc,
                  namaUser: namaUser,
                  DBfilename: dbFilename}).save(function(err, data){
                    if(err){
                      res.send(err)
                    }
                    res.send(data)
                    console.log("succ")
                  })

      console.log('succ file!')
});


app.get('/deletefile/:filename', (req,res) =>{
  gfs.remove({filename: req.params.filename, root: 'files'}, function (err, res) {
    if (err){
      res.send(err);
    }
    else{
      fileSchema.deleteOne({DBfilename: req.params.filename}, function(err, data){
        if(err){
            throw err;
        }
        else{
            console.log('Data file berhasil dihapus');
            console.log(data)
            //res.redirect('/');
        }
        //console.log('success');
      });
    }  
  });
  res.send('/')
  console.log("File removed")

})

app.get('/download/:filename', function(req, res){
 /** First check if file exists */
  gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
      if(!files || files.length === 0){
          return res.status(404).json({
              responseCode: 1,
              responseMessage: "error"
          });
      }
      /** create read stream */
      var readstream = gfs.createReadStream({
          filename: files[0].filename,
          root: "files"
      });
      /** set the proper content type */
      res.set('Content-Type', files[0].contentType)
      /** return response */
      return readstream.pipe(res);
  });
});

app.get('')

app.get('/user/myfiles/:username', (req,res) =>{
  fileSchema.find({namaUser: req.params.username}, (err, result) =>{
    if(err){
      res.send(err)
    }else{
      //res.send(result)
      //result.totalPoin = result.totalPoin

      res.render('myfiles', {data:result})
    }
  })

})









app.get('/register', (req,res) =>{
  res.render('register')
})


app.get('/login', (req,res) =>{
  res.render('login')
})

// app.post('/testEncryption', (req, res) =>{
//   var password = req.body.password
//   bcrypt.hash(password, saltRounds, (err,hash) =>{
//     if(err) res.send(err)
//     res.send(hash)
//   })
// })


//Authentication & Register 

app.post('/login', (req,res) =>{
  var hash = req.body.password
  hash = bcrypt.hash(hash, saltRounds, (err,hash) =>{
    if(err) res.send(err)
  })
  User.findOne({username: req.body.username,
                password: hash}, (err, data) =>{
                  if(err) res.render('login', {msg: err})
                  else if(!data){
                    res.status(400)
                    res.render('login', {msg: 'user not found'})
                  }
                  else{
                    delete res.password
                    console.log(data)
                    res.render('upload')
                  }
                })
  //console.log(data)
})

app.post('/file/poin/:filename', (req,res,next) =>{
  fileSchema.findOne({filename: req.params.filename}, (err, data) =>{
    if(err) res.send(err)

    else if(!data){
      res.send('file sudah tidak ada')
    }
    else{
      let poin = data.totalPoin
      let jumlahRating = data.jumlahrating
      jumlahRating = jumlahRating + 1
      poin = (poin + req.body.poin)/jumlahRating
      fileSchema.updateOne({filename: req.params.filename}, 
                          {$set: {totalPoin: poin, 
                                  jumlahRating: jumlahRating}}
                                  , (err, result) =>{

                                    if(err) res.send(err)
                                    else{
                                      res.send(result)
                                    }
                                  })
    }
  })

})

app.post('/register', (req,res) =>{
  var username = req.body.username
  var email = req.body.email
  var namaLengkap = req.body.namaLengkap
  var institusi = req.body.institusi
  var akunFacebook = req.body.akunFacebook
  var akunInstagram = req.body.akunInstagram
  var akunYoutube = req.body.akunYoutube
  var password = req.body.password
  bcrypt.hash(password, saltRounds, (err,hash) =>{
    if(err) res.send(err)
    else
    {
      //res.send(hash)
      User({username: username,
        email: email,
        namaLengkap: namaLengkap,
        institusi: institusi,
        akunFacebook: akunFacebook,
        akunInstagram: akunInstagram,
        akunYoutube: akunYoutube,
        password: hash,
        poin: 0,
        jumlahFile: 0}).save(function(err, data){
          if(err){
            res.send(err)
          }
          delete res.password
          res.send(data)
          console.log("succ")
        })
    }
  })
  //var bio = req.body.bio
              // username: String,
              // email: String,
              // namaLengkap: String,
              // institusi: String,
              // akunFacebook: String,
              // akunInstagram: String,
              // akunYoutube: String,
              // bio: String
})

















//Port


var server = app.listen(PORT, function () {
    var port = server.address().port;
    console.log("Express is working on port " + port);
  });


module.exports = app;