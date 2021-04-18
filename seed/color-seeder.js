var Color = require('../models/color');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', function(err) {
    if(err) 
      console.log('NOT CONNECTED')

    console.log('CONNECTED');
});

var colors = [
    new Color({
        colorName: 'Black',
        hexValue: '#000000'
    }),
    new Color({
        colorName: 'Blue',
        hexValue: '#0000FFF'
    }), 
    new Color({
        colorName: 'Green', 
        hexValue: '#00FF00'
    }),
    new Color({
        colorName: 'Red',
        hexValue: '#FF0000'
    })
];

var done = 0;
for (var i = 0; i < colors.length; i++) {
    colors[i].save(function(err, result) {
        console.log('SAVED');
        done++;
        if(done === colors.length) 
            console.log('EXITING');
            exit();
           
    })
}

function exit() {
    mongoose.disconnect(); 
}