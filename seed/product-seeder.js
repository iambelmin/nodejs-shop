var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', function(err) {
    if(err) 
      console.log('NOT CONNECTED')

    console.log('CONNECTED');
});

var products = [
    new Product({    
        title: 'Woolen t-shirt',
        category: 'T-Shirts',
        description: 'Lorem ipsum dolor sit ammet',
        size: ['XS', 'L', 'M'],
        color: ['Blue', 'Red', 'Black'],
        price: 253,
        mainImagePath: 'images/product-slider-main.jpg',
        imagePaths: ['images/product-slider-main.jpg', 'images/product.jpg'],
        isFreeShipping: true
    }),
    new Product({
        title: 'Red jacket with diamonds',
        category: 'Jackets',
        description: 'Lorem ipsum dolor sit ammet',
        size: ['S', 'XXL'],
        color: 'Red',
        price: 225,
        mainImagePath: 'images/product-slider-main.jpg',
        imagePaths: ['images/product-slider-main.jpg', 'images/product.jpg'],
        isFreeShipping: false
    }),
    new Product({
        title: 'Black lether bag',
        category: 'Bags',
        description: 'Lorem ipsum dolor sit ammet',
        size: ['XS', 'S', 'M'],
        color: 'Black',
        price: 500,
        mainImagePath: 'images/product-slider-main.jpg',
        imagePaths: ['images/product-slider-main.jpg', 'images/product.jpg'],
        isFreeShipping: false
    }),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        console.log('SAVED');
        done++;
        if(done === products.length) 
            console.log('EXITING');
            exit();
           
    })
}

function exit() {
    mongoose.disconnect(); 
}