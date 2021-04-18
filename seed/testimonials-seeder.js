var Testimonails = require('../models/testimonials');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', function(err) {
    if(err) 
      console.log('NOT CONNECTED')

    console.log('CONNECTED');
});

var testimonials = [
    new Testimonails({
        text: 'best online web shop!!',
        author: 'John Doe'
    })
];

var done = 0;
for (var i = 0; i < testimonials.length; i++) {
    testimonials[i].save(function(err, result) {
        console.log('SAVED');
        done++;
        if(done === testimonials.length) 
            console.log('EXITING');
            exit();
    })
}

function exit() {
    mongoose.disconnect(); 
}