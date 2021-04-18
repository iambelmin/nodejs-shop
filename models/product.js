var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true}, 
    category: {type: String}, 
    description: {type: String},
    size: [String],
    color: [String],
    price: {type: Number},
    mainImagePath: {type: String, required: true},
    imagePaths: [String],
    isFreeShipping: {type: Boolean}

});

module.exports = mongoose.model('Product', schema);
