var express = require('express');
var router = express.Router();
var async = require('async');
var Product = require('../models/product');
var Category = require('../models/category');

var productQuery = Product.find();
var categoryQuery = Category.find();
var resources = {
    products: productQuery.exec.bind(productQuery),
    categories: categoryQuery.exec.bind(categoryQuery)
}



/* GET home page. */
router.get('/', function(req, res, next) {
  async.parallel(resources, (err, results) => {
    if(err) throw err;
    var msg = req.flash('addedCart')[0];
    res.render('shop/webshop', {items: results, sucMsg: msg, noSucMessage: !msg})
  });
});


router.get('/:categoryName', function(req, res, next){
  var results = {};

  var tasks = [
    function(callback) {
      Product.find({'category': req.params.categoryName}).exec((err, products) => {
        if(err) return callback(err);
        results.products = products;
        callback();
      })
    }, 
    function(callback) {
      Category.find().exec((err, categories) => {
        if(err) return callback(err);
        
        results.categories = categories;
        callback();
      })
    }, 
  ];

  async.parallel(tasks, function(err) {
    if(err) return next(err);
    
    
    res.render('shop/webshop', {items: results, noSucMessage: true});
  });
 

});

//Product Details page
router.get('/product/:objectID', function(req, res, next) {
  Product.find({'_id': req.params.objectID}).exec((err, products) => {
    productDetails = products;
    res.render('shop/productDetails', {productDetails});
  });
});

module.exports = router;
