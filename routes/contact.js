var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/contact');
});

router.post('/send', function(req, res, next) {
  
    const outputHTML = `
        <h3>Contact Details</h3>
        <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    const outputPlain = `
        Contact Details:
        - Name: ${req.body.name}
        - Email: ${req.body.email}

        Message:
        ${req.body.message}
    `;
    async function main() {
        
      
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
        //   host: 'smtp.gmail.com',
        //   port: 465,
       service:'gmail',
          auth: {
              user: 'webshopemail@example.com',
              pass: 'TESTPASSWORD#'
          }
      });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: `"NODE WEBSHOP ${req.body.email}` , // sender address
          to: 'webshopemail@example.com', // list of receivers
          subject: 'NODE WEBSHOP - Kontakt', // Subject line
          text: outputPlain, // plain text body
          html: outputHTML, 
          replyTo: `${req.body.email}`
        });

        res.render('shop/contact', {msg: 'Ihre Nachricht wurde erfolgreich an uns abgeschickt'});
      }
      
      main().catch(console.error);
   
});



module.exports = router;
