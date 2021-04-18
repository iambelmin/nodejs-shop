var Category = require('../models/category');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', function(err) {
    if(err) 
      console.log('NOT CONNECTED')

    console.log('CONNECTED');
});

var categories = [
    new Category({
        categoryName: 'T-Shirts'
    }),
    new Category({
        categoryName: 'Sweaters'
    }),
    new Category({
        categoryName: 'Jackets'
    }),
    new Category({
        categoryName: 'Bags'
    })
];

var done = 0;
for (var i = 0; i < categories.length; i++) {
    categories[i].save(function(err, result) {
        console.log('SAVED');
        done++;
        if(done === categories.length) 
            console.log('EXITING');
            exit();
           
    })
}

function exit() {
    mongoose.disconnect(); 
}