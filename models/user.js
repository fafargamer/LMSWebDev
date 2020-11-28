const User = ({
    username: String,
    email: String,
    namaLengkap: String,
    institusi: String,
    akunFacebook: String,
    akunInstagram: String,
    akunYoutube: String,
    bio: String
});
    
module.exports = User;



// PersonModel.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } }, //For Reference
//     done
// );