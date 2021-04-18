var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type:String, required: true},
    text: {type: String, required: true}
});

module.exports = mongoose.model('About', schema);