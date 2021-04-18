var Size = require('../models/size');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', function(err) {
    if(err) 
      console.log('NOT CONNECTED')

    console.log('CONNECTED');
});

var sizes = [
    new Size({
        sizeMark: 'XS'  
    }),
    new Size({
        sizeMark: 'S'
    }),
    new Size({
        sizeMark: 'M'
    }), 
    new Size({
        sizeMark: 'L'
    }),
    new Size({
        sizeMark: 'XL'
    }),
    new Size({
        sizeMark: 'XXL'
    })
];

var done = 0;
for (var i = 0; i < sizes.length; i++) {
    sizes[i].save(function(err, result) {
        console.log('SAVED');
        done++;
        if(done === sizes.length) 
            console.log('EXITING');
            exit();
           
    })
}

function exit() {
    mongoose.disconnect(); 
}