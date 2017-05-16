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

router.post('/', function(req, res){
  var api_key = 'key-430a017b2d04af9af2d9cfd80e7a2c08';
  var domain = 'sandboxc1a42f17212546f1b27b27d149b04546.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: 'as196.ru <postmaster@sandboxc1a42f17212546f1b27b27d149b04546.mailgun.org>',
    to: 'tmn-as72@yandex.ru',
    subject: 'Заявка',
    html: "Категория: "+req.body.a+" "+req.body.b+" "+req.body.c+" "+req.body.d+" "+req.body.e+"<br /><br />"+
    "Район: "+req.body.center+" "+req.body.viz+" "+req.body.uralmash+" "+req.body.sort+" "+req.body.kirov+" "+req.body.chkalov+"<br /><br />"+
    "Тип обучения: "+req.body.online+" "+req.body.group+"<br /><br />"+
    "Тип трансмиссии: "+req.body.mkpp+" "+req.body.akpp+"<br /><br />"+
    "Номер телефона: "+req.body.phone
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
