var express = require('express'),
    swig = require('swig'),
    CitiesDAO = require('./db.js'),
    config = require('./config.json'),
    async = require('async');

var tape = require('tape');

var Flickr = require('flickrapi'),
    MongoClient = require('mongodb').MongoClient;

var db, flickr;

async.series([
  function (cb){
    MongoClient.connect('mongodb://localhost/travel', function (err, db){
      if(err) return cb(err, null);

      cb(null, db);
    });
  },
  function (cb){
    var options = {
      api_key : config.api_key,
      secret : config.secret_key
    }

    Flickr.tokenOnly(options, function (err, flickr){
      if(err) return cb(err, null);

      cb(null, flickr);
    });
  }
], function (err, res){
  if(err) throw err;

  db = new CitiesDAO(res[0]);
  flickr = res[1];
});

var app = express();

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
