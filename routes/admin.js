var express = require('express');
var router = express.Router();
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');
var Testimonials = require('../models/testimonials');
var Category = require('../models/category');
var Color = require('../models/color');
var Size = require('../models/size');
var Product = require('../models/product');
var multer = require('multer');
var async = require('async');
var categoryQuery = Category.find().sort({_id: -1});
var colorQuery = Color.find();
var sizeQuery = Size.find();
var Cart = require('../models/cart');
var User = require('../models/user');
var resources = {
    categories: categoryQuery.exec.bind(categoryQuery),
    colors: colorQuery.exec.bind(colorQuery),
    sizes: sizeQuery.exec.bind(sizeQuery)
}
var About = require('../models/about');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
    
})

var upload = multer({storage: storage, limits: {
    fileSize: 1024*1024*5
}});

router.get('/', (req, res, next) =>{
    if(req.user) {
       res.redirect('/admin/main');
    } else {
        res.render('admin/login', { layout: 'adminlayout'});
    }
});

router.get('/main', (req, res, next) =>{
    if(req.user) {
        Order.find().exec((err, orders) => {
            if(err) {
                return res.write('Error!');
            }
            var cart;
            orders.forEach(function(order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('admin/main', {layout: 'adminlayout', orders: orders})  
        });
    } else {
        res.redirect('/admin');
    }
});
router.get('/orderdelete/:id', function(req,res,next) {
    if(req.user) {
        Order.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/main');
        });
    } else {
        res.redirect('/admin');
    }
  
});


router.get('/products', (req, res, next) =>{
    if(req.user) {
        Product.find().exec((err, results) => {
            if(err) {
                return res.write('Error!');
            }
            res.render('admin/products', { layout: 'adminlayout', results});
        });
    } else {
        res.redirect('/admin');
    }
});
router.get('/deleteproduct/:id', function(req,res,next) {
    if(req.user) {
        Product.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/products');
        });
    } else {
        res.redirect('/admin')
    }
});

router.get('/editProduct/:id',function(req, res, next){
    if(req.user){
        async.parallel(resources, (err, results) => {
            if(err) throw err;
            //console.log(results);
        
            Product.findOne({'_id':req.params.id}, (err, resultsID)=>{
                if(err) throw err;
                // console.log(resultsID)

                res.render('admin/editproduct', {layout: 'adminlayout', results, resultsID,
                helpers: {
                    equal: function (a,b,opt) {
                      
                        //Check what data on product already exist
                        for(var i=0; i<resultsID[a].length;i++)
                            if (resultsID[a][i] == b) 
                                return opt.fn(this);
                            
                        return opt.inverse(this);
                    }
                }
            });
        

        })
    });
        
    }
    else{
        res.redirect('/admin');
    }
});


router.post('/saveprod', upload.fields([{name: 'mainImage', maxCount: 1}, {name: 'images', maxCount: 4}]), (req, res, next) => {
    if(req.user ) {

        var product = {
            title: req.body.title,
            category: req.body.cat,
            description: req.body.desc,
            size: req.body.size || '',
            color: req.body.color || '',
            price: req.body.price,
            isFreeShipping: req.body.freeShipping == 'yes' ? true : false
        };

        if(req.files['images'] != null){
            var arrayFiles = req.files['images'];
            var paths = [];
            arrayFiles.forEach(element => {
                element.path = element.path.replace('public/', '') && element.path.replace('public\\', '');
                paths.push(element.path);
            });
            product.imagePaths = paths;
        }
       

        if(req.files['mainImage'] != null){
            product.mainImagePath = req.files['mainImage'][0].path.replace('public/', '') && req.files['mainImage'][0].path.replace('public\\', '');
        }
        
        Product.findByIdAndUpdate(req.body.id, product, (err, result)=> {
            if(err)
               res.send('Error!');
            res.redirect('/admin/products');
        });

    } else {
        res.redirect('/admin');
    }
});


router.get('/addProducts', (req, res, next) => {
    if(req.user) {
        async.parallel(resources, (err, results) => {
            if(err) throw err;
        
            res.render('admin/addproduct', {layout: 'adminlayout', results});
            console.log(results);
        });
    } else {
        res.redirect('/admin');
    }   
});
router.post('/addingProd', upload.array('images', 4), (req, res, next) => {
    if(req.user && req.files) {
        var arrayFiles = req.files;
        var paths = [];
        arrayFiles.forEach(element => {
            element.path = element.path.replace('public/', '');
            paths.push(element.path);
        });
        
        var product = new Product({
            title: req.body.title,
            category: req.body.cat,
            description: req.body.desc,
            size: req.body.size,
            color: req.body.color,
            price: req.body.price,
            mainImagePath: req.files[0].path,
            imagePaths: paths,
            isFreeShipping: req.body.freeShipping == 'yes' ? true : false
        });

        product.save(function(err, result) {
            if(err) {
                return res.write('Error!');
            }
            res.redirect('/admin/products');
        });
    } else {
        res.redirect('/admin');
    }
    
});

router.get('/testimonials', (req, res, next) =>{
    if(req.user) {
        Testimonials.find().exec((err, results) => {
            if(err) {
                return res.write('Error!');
            }
            res.render('admin/testimonials', { layout: 'adminlayout', results});
        });
    } else {
        res.redirect('/admin');
    }
});

router.get('/testimonialdelete/:id', function(req,res,next) {
    if(req.user) {
        Testimonials.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/testimonials');
        });
    } else {
        res.redirect('/admin')
    }
});

router.post('/addtestimonial', function(req, res, next) {
    if(req.user) {
        var test = new Testimonials({
            text: req.body.testimonialText,
            author: req.body.author
        });
        test.save(function(err, result) {
            if(err) {
                return res.write('Error!');
            }
            res.redirect('/admin/testimonials');
        });
    } else {
        res.redirect('/admin');
    }
});

router.get('/users', (req, res, next) =>{
    if(req.user) {
        User.find().exec((err, results) => {
            if(err) {
                return res.write('Error!');
            }
            res.render('admin/user', { layout: 'adminlayout', results});
        });
    } else {
        res.redirect('/admin');
    }
});
router.get('/userdelete/:id', function(req,res,next) {
    if(req.user) {
        User.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/users');
        });
    } else {
        res.redirect('/admin')
    }
});

router.post('/useradd', function(req, res, next) {
    if(req.user) {
        var test = new User({
            username: req.body.usr,
            password: req.body.pwd,
            notSuperUser: 1
        });
        test.save(function(err, result) {
            if(err) {
                return res.write('Error!');
            }
            res.redirect('/admin/users');
        });
    } else {
        res.redirect('/admin');
    }
});

router.get('/about', (req, res, next) =>{
    if(req.user) {
        About.find().exec((err, results) => {
            if(err) {
                return res.write('Error!');
            }
            res.render('admin/about', { layout: 'adminlayout', results});
        });
    } else {
        res.redirect('/admin');
    }
});

router.get('/aboutdelete/:id', function(req,res,next) {
    if(req.user) {
        About.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/about');
        });
    } else {
        res.redirect('/admin')
    }
});

router.post('/addabout', function(req, res, next) {
    if(req.user) {
        var test = new About({
            title: req.body.title,
            text: req.body.text
        });
        test.save(function(err, result) {
            if(err) {
                return res.write('Error!');
            }
            res.redirect('/admin/about');
        });
    } else {
        res.redirect('/admin');
    }
});




router.get('/categories', (req, res, next) =>{
    if(req.user) {
        Category.find().exec((err, results) => {
            if(err) {
                return res.write('Error!');
            }
            res.render('admin/categories', { layout: 'adminlayout', results});
        });
    } else {
        res.redirect('/admin');
    }
});
router.get('/categorydelete/:id', function(req,res,next) {
    if(req.user) {
        Category.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/categories');
        });
    } else {
        res.redirect('/admin');
    }
});

router.post('/addcategory', function(req, res, next) {
    if(req.user) {
        var test = new Category({
            categoryName: req.body.category
        });
        test.save(function(err, result) {
            if(err) {
                return res.write('Error!');
            }
            res.redirect('/admin/categories');
        });
    } else {
        res.redirect('/admin');
    }
});


router.get('/colors', (req, res, next) =>{
    if(req.user) {
        Color.find().exec((err, results) => {
            if(err) {
                return res.write('Error!');
            }
            res.render('admin/colors', { layout: 'adminlayout', results});
        });
    } else {
        res.redirect('/admin');
    }
});
router.get('/colordelete/:id', function(req,res,next) {
    if(req.user) {
        Color.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/colors');
        });
    } else {
        res.redirect('/admin');
    }
});
router.post('/addcolor', function(req, res, next) {
    if(req.user) {
        var test = new Color({
            colorName: req.body.color,
            hexValue: '#000'
        });
        test.save(function(err, result) {
            if(err) {
                return res.write('Error!');
            }
            res.redirect('/admin/colors');
        });
    } else {
        res.redirect('/admin');
    }
});

router.get('/sizes', (req, res, next) =>{
    if(req.user) {
        Size.find().exec((err, results) => {
            if(err) {
                return res.write('Error!');
            }
            res.render('admin/sizes', { layout: 'adminlayout', results});
            console.dir(results);
        });
    } else {
        res.redirect('/admin');
    }
});

router.get('/sizedelete/:id', function(req,res,next) {
    if(req.user) {
        Size.deleteOne({'_id': req.params.id}, function(err) {
            if(err){
                return res.write('Error!');
            } 
            res.redirect('/admin/sizes');
        });
    } else {
        res.redirect('/admin');
    }
});

router.post('/addsize', function(req, res, next) {
    if(req.user) {
        var test = new Size({
            sizeMark: req.body.size
        });
        test.save(function(err, result) {
            if(err) {
                return res.write('Error!');
            }
            res.redirect('/admin/sizes');
        });
    } else {
        res.redirect('/admin');
    }
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/admin/main/',
                                   failureRedirect: '/admin/',
                                   failureFlash: true })
                                   
);

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/admin');
}); 

module.exports = router;