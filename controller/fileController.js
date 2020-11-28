const Product = require('../models/file.js');

exports.file_create = function (req, res) {
    let product = new Product(
        {
            filename: req.body.filename,
            userName: "UserName",
            desc: req.body.filedescription,
            DFfilename: "Test"
        }
    );
    product.save(function (err) {
        if (err) {
            return next(err);
        }
        console.log('File added successfully')
    })
};


exports.file_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted product'+req.params.id+'succesfully')
    })
};