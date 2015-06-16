var express = require('express'),
    swig = require('swig'),
    tape = require('tape'),
    MongoClient = require('mongodb').MongoClient,
    CitiesDAO = require('./db.js');

MongoClient.connect('mongodb://localhost/travel', function (err, connection){
  if(err) throw err;

  var app = express();

  var db = new CitiesDAO(connection);

  app.engine('html', swig.renderFile);

  app.use(express.static('public'));

  app.set('view engine', 'html');

  app.get('/', function (req, res, next){
    db.getCity(function(err, city){
      if(err) return next(err);

      res.render('index', {
        city : city.name
      });
    });
  });

  app.use(function (err, req, res, next){
    res.status(500).send();
  });

  app.listen(3000, function (){
    console.log('listening');
  });

});
