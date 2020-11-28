// const express = require('express');
// const multer = require('multer');
// const ejs = require('ejs');
// const path = require('path');
// var fs = require('fs');

// const app = express()

// var fileSchema = require('../models/file.js');


// // const storage = multer.diskStorage({
// //   destination: '../uploads/',
// //   filename: function(req, file, cb){
// //     cb(null,req.body.filenameText + '-' + Date.now() + path.extname(file.originalname));
// //   }
// // });

// // init Storage
// var storage = multer.diskStorage({ 
//   destination: (req, file, cb) => { 
//       cb(null, 'controller/uploads') 
//   }, 
//   filename: (req, file, cb) => { 
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) 
//   } 
// }); 

// var downloadStorage = multer.diskStorage({ 
//   destination: (req, file, cb) => { 
//       cb(null, 'controller/downloads') 
//   }, 
//   filename: (req, file, cb) => { 
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) 
//   } 
// }); 

// var upload = multer({ storage: storage });
// var download = multer({ storage: downloadStorage });



// // // Check File Type
// // function checkFileType(file, cb){
// //   // Allowed ext
// //   const filetypes = /jpeg|jpg|png|gif/;
// //   // Check ext
// //   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// //   // Check mime
// //   const mimetype = filetypes.test(file.mimetype);

// //   if(mimetype && extname){
// //     return cb(null,true);
// //   } else {
// //     cb('Error: Images Only!');
// //   }
// // }

// app.get('/upload', (req,res) => {
//     res.render('upload');
// });

// // Uploading the file 
// app.post('/upload', upload.single('fileNameforUpload'), (req, res) => { 
  
//   var obj = { 
//     name: req.body.filename, 
//     desc: req.body.filedescription, 
//     file: { 
//         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
//         contentType: path.extname(req.file.filename)
//       }  
//   }
//   fileSchema.create(obj, (err, item) => { 
//       if (err) { 
//           console.log(err); 
//           res.render('upload', {
//             msg: err
//           })
//       } 
//       else { 
//           item.save();
//           console.log(obj) 
//           fs.unlinkSync(path.join(__dirname + '/uploads/' + req.file.filename))
//           res.render('upload', {
//             msg: 'Success file Upload!'
//           }); 
//       } 
//   }); 
// });

// app.get('/download/:filename', (req,res) =>{
//   fileSchema.findOne({"name": req.query.filename}, (err, items) => { 
//     if (err) { 
//         console.log(err); 
//     } 
//     else { 
//         res.send(items);
//         console.log(items) 
//     } 
//   }); 
// })

// module.exports = app;