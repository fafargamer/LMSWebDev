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
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override')
var Binary = require('mongodb').Binary;
var fs = require('fs');
const routes  = require('./routes/web.js');
const uploadController  = require('./controller/upload.js');

// const file = require('./models/file.js');



const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(routes)
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

var User = conn.model('User', require('./models/user.js'));
var fileSchema = conn.model('fileSchema', require('./models/file.js'));



//init stream
conn.once('open', () => 
{
  gfs = Grid(conn.db, mongo.mongo);
  gfs.collection('files')

  // all set!
})

var db = conn.db

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|docx|pptx|ppt|doc|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('File type not allowed!');
    }
}

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

// app.use(mongodb(mongoUrl));

// init gfs
// let gfs;
// conn.once("open", () => {
//   // init stream
//   gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: "uploads"
//   });
// });






app.get('/', (req,res) => {
    res.render('upload');
});

app.post('/upload', upload.single('fileNameforUpload'), (req,res,next) => {
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

app.get('/getfiles/:username', (req,res) =>{
  fileSchema.find({namaUser: req.params.username}, (err, result) =>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })

})

app.get('/register', (req,res) =>{
  var username = req.body.username
  var email = req.body.email
  var namaLengkap = req.body.namaLengkap
  var institusi = req.body.institusi
  var akunFacebook = req.body.akunFacebook
  var akunInstagram = req.body.akunInstagram
  var akunYoutube = req.body.akunYoutube
  var bio = req.body.bio
        User({username: username,
              email: email,
              namaLengkap: namaLengkap,
              institusi: institusi,
              akunFacebook: akunFacebook,
              akunInstagram: akunInstagram,
              akunYoutube: akunYoutube,
              bio: bio}).save(function(err, data){
                if(err){
                  res.send(err)
                }
                res.send(data)
                console.log("succ")
              })

              // username: String,
              // email: String,
              // namaLengkap: String,
              // institusi: String,
              // akunFacebook: String,
              // akunInstagram: String,
              // akunYoutube: String,
              // bio: String
})

// app.post('/upload', upload.single('fileNameforUpload'), (req, res) =>{
//       if(err){
//            result.json({error_code:1,err_desc:err});
//            return;
//       }       
//        //res.json({error_code:0,err_desc:null});
//       res.send(req.file)
//       global.originalname = req.file.filename
//   });
// });

app.get('/file/:filename', function(req, res){
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



var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log("Express is working on port " + port);
  });


module.exports = app;