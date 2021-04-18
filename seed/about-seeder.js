var About = require('../models/about');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop');

var about = [
    new About({
        title: 'More about Me',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }),
    new About({
        title: 'HANDCRAFTS',
        text: 'Led ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, '
    })
];

var done = 0;
for (var i = 0; i < about.length; i++) {
    about[i].save(function(err, result) {
        console.log('SAVED');
        done++;
        if(done === about.length) 
            console.log('EXITING');
            exit();
           
    })
}

function exit() {
    mongoose.disconnect(); 
}