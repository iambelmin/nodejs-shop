var User = require('../models/user');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', function(err) {
    if(err) 
      console.log('NOT CONNECTED')

    console.log('CONNECTED');
});

var users = [
    new User({
        username: 'admin',
        password: 'd41d8cd98',
        notSuperUser: 0
    }),
    new User({
        username: 'belmo',
        password: 'belmin123',
        notSuperUser: 1
    }),
];  

var done = 0;
for (var i = 0; i < users.length; i++) {
    users[i].save(function(err, result) {
        console.log('SAVED');
        done++;
        if(done === users.length) 
            console.log('EXITING');
            exit();
    })
}

function exit() {
    mongoose.disconnect(); 
}