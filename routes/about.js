var express = require('express');
var router = express.Router();
var About = require('../models/about');

/* GET home page. */
router.get('/', function(req, res, next) {
  About.find().limit(2).sort({_id: -1}).exec((err, result) => {
      res.render('shop/about', {items: result});
  });
});

module.exports = router;
