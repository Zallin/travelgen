var express = require('express'),
    swig = require('swig'),
    config = require('./config.json');

var Flickr = require('flickrapi'),
    MongoClient = require('mongodb').MongoClient;

var async = require('async');

var app = express();

app.engine('html', swig.renderFile);

app.use(express.static('public'));

app.set('view engine', 'html');

async.series([
  function (cb){
    MongoClient.connect(config.connection, function (err, db){
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

  res.push(app);

  require('./routes').apply(null, res);
});

app.use(function (err, req, res, next){
  res.status(500).send();
});

app.listen(3000, function (){
  console.log('listening');
});
