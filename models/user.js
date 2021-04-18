var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: {type:String, required: true},
    password: {type:String, required: true},
    notSuperUser: {type:Boolean, required: true}
});
schema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

module.exports = mongoose.model('User', schema)