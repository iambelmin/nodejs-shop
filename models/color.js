var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    colorName: {type: String, required: true},
    hexValue: {type: String, required: true}
});

module.exports = mongoose.model('Color', schema);
