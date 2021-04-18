var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var About = require('../models/about');
var Testimonials = require('../models/testimonials');
var async = require('async');
var productQuery = Product.find().limit(4).sort({_id: -1});
var aboutQuery = About.find().limit(1);
var testimonialsQuery = Testimonials.find();
var Cart = require('../models/cart');
var resources = {
    products: productQuery.exec.bind(productQuery),
    abouts: aboutQuery.exec.bind(aboutQuery),
    testimonials: testimonialsQuery.exec.bind(testimonialsQuery)
}
var Order = require('../models/order');
/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  var errMsh = req.flash('errorOrder')[0];
  async.parallel(resources, (err, result) => {
    if(err) throw err;

    res.render('shop/index', {items: result, successMsg: successMsg, noMessage: !successMsg, errMessage: errMsh, noErrMessage: !errMsh});
    
  })
});

router.post('/add-to-cart/', function(req, res, next) {
  var productId = req.body.id;
  var prodColor = req.body.color;
  var prodSize = req.body.sizes;

  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if(err) {
      throw err;
    }

    cart.add(product, product.id, prodSize, prodColor);
    req.session.cart = cart;
    req.flash('addedCart', 'Product is added to cart! - ' + product.title );
    res.redirect('/shop');
    
  });
});


router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});



router.get('/shopping-cart/', function(req, res, next) {
  if(!req.session.cart) {
    return res.render('shop/cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
})

router.get('/checkout', function(req, res, next) {
  if(!req.session.cart) {
    res.redirect('shop/cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {totalPrice: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/search', function(req, res, render) {
  Product.find({'title': {$regex: '.*'+ req.body.searchString +".*"}}).exec((err, results) => {
    if(err) throw err;
    
    const items = {
      products: results
    }
    res.render('shop/webshop', {items, noSucMessage: true});
  })
});

router.post('/checkout', function(req, res, next) {
  if(!req.session.cart) {
    res.redirect('/shop');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")("KEY_API");
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "eur",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Shop - Article bought"
  }, function(err, charge) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }

      var orders = new Order({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phoneNumber: req.body.phone,
        cart: cart,
        paymentId: charge.id
      });
      orders.save(function (err, result) {
        if(err) {
          req.flash('errorOrder', 'Order was not made.');
          res.redirect('/');
        }
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
      })
      
  });

});

module.exports = router;
