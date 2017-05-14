var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Автошколы Екатеринбурга' });
// });

//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.route('/')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('School').find({}, function (err, schools) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('index', {
                              title: 'Автошколы Екатеринбурга',
                              "schools" : schools
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(schools);
                    }
                });
              }
        });
    })
    //POST a new blob
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var _id = req.body._id;
        var name = req.body.name;
        var number = req.body.number;
        var category = req.body.category;
        var description = req.body.description;
        var adress1 = req.body.adress1;
        var adress2 = req.body.adress2;
        var adress3 = req.body.adress3;
        var adress4 = req.body.adress4;
        var adress5 = req.body.adress5;
        //call the create function for our database
        mongoose.model('School').create({
            _id : _id,
            name : name,
            number : number,
            category : category,
            description : description,
            adress1 : adress1,
            adress2 : adress2,
            adress3 : adress3,
            adress4 : adress4,
            adress5 : adress5
        }, function (err, school) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //School has been created
                  console.log('POST creating new blob: ' + school);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("admin");
                        // And forward to success page
                        res.redirect("/");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(school);
                    }
                });
              }
        })
    });

router.post('/', function(req, res){
  var api_key = 'key-5ad1c1ffab948dc79d0ca7609390c8c1';
  var domain = 'sandbox590b0d34e0a14c06bd26236260de0fb4.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: 'Excited User <postmaster@sandbox590b0d34e0a14c06bd26236260de0fb4.mailgun.org>',
    to: 'tmn.amd@gmail.com',
    subject: req.body.Name,
    html: req.body.body
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    if(!error)
      res.send("Mail Sent");
    else
      res.send("Mail not sent")
  });
});

router.get('/pdd', function(req, res){
  res.render('pdd/index');
});

router.get('/contact', function(req, res){
  res.render('contact');
});

module.exports = router;
