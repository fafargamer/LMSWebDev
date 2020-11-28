const render = require('ejs');
const express = require('express');
const bcrypt = require('bcrypt')

const app = express();
var User = require('../models/user.js');
var fileData = require('../models/file.js');
var User2 = require('../models/user2.js');




app.set('view engine', 'ejs');
app.use(express.static('../public'))


app.get('/', (req,res) => {
    res.render('upload');
});

// app.get('/login', (req,res) => {
//     res.render('login');
// });

// app.get('/login', (req,res) => {
//     res.render('login');
// });

// app.post('/register2', (req,res) => {
//     var username = req.body.username
//     var password = req.body.password
//     var bio = req.body.bio
//     var saltRounds = 10;
//     bcrypt.genSalt(saltRounds, (err, salt) => {
//         bcrypt.hash(password, salt, (err, hash) => {
//             // Now we can store the password hash in db.
//         });
//     });

    

    // res.send(password)

    // if(err) throw new Error('Gagal mendapatkan username');
    // if(result){
    //     let response = {
    //         success: false,
    //         data: {
    //             message: "User sudah terdaftar"
    //         }
    //     }
    //     res.status(404).json(response);
    // }
    // else {
    //     req.db.collection('users').insertOne({"username": username,"password": password,"fullname": fullname,"nim": nim}, (err, result) => {
    //         if(err) throw new Error('Gagal menambahkan username');
    //         delete result.password
    //         let response = {
    //             success: true,
    //             data : result
    //         }
    //         res.status(200).json(response);
    //     })
    // }

// });

// app.post('/uploadMeta', (req,res) =>{
//     fileData({filename: req.body.filename,
//                 desc: req.body.filedescription,
//                 DBfilename: "hello",
//                 namaUser: "NewUser"
//               }).save(function(err, data){
//                 if(err){
//                     res.send(err)
//                 }
//                 else{

//                     res.send(data);
//                 }
//               })
// });


module.exports = app;