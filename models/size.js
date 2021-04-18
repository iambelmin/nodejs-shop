var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    sizeMark: {type: String, required: true}
});

module.exports = mongoose.model('Size', schema);
