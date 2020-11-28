const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    namaLengkap: String,
    institusi: String,
    akunFacebook: String,
    akunInstagram: String,
    akunYoutube: String,
    bio: String,
    hash: String,
    salt: String,
    files: [{
            filename: String
        }]
  }, 
  {
      timestamps: true
    });
    
module.exports = mongoose.model('User', UserSchema);



// PersonModel.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } }, //For Reference
//     done
// );