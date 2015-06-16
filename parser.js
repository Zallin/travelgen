var http = require('http'),
    cheerio = require('cheerio'),
    MongoClient = require('mongodb').MongoClient;

var pages = {};

function requestPage(host, url, fn){
  var cache = '';

  var opts = {
    hostname : host,
    path : url,
    method : 'GET'
  }

  var req = http.request(opts, function (res){
    res.on('data', function (chunk){
      cache += chunk.toString();
    });

    res.on('end', function (){
      var _id = Math.floor(Math.random() * 1000 * 60);
      pages[_id] = cheerio.load(cache);
      fn(pages[_id]);
    });
  });

  req.end();
}

var handler = (function (){
  var invoked = 0, lim, cb;
  return {

    set : function (n, fn){
      lim = n;
      cb = fn;
    },

    callback : function (){
      if(++invoked === lim) return cb();
    }
  }
})();

var count = 0;

requestPage('www.lonelyplanet.com', '/places', function (page){
  var urls = [];

  page('a.card--list.media').each(function (i, el){
    urls[i] = page(el).attr('href');
  });

  pages = {};

  var cities = [];

  handler.set(urls.length, function (){
    
  });

  for(var i = 0; i < urls.length; i++){
    requestPage('www.lonelyplanet.com', urls[i], function (page){
      var alert = page('div.icon--caution--before');
      if(alert.length) return handler.callback();

      var container = page('article.card--destination');

      container.each(function (i, el){
        var city = page(el).find('h1.card__content__title').text();
        cities.push(city);
      });

      handler.callback();
    });
  }
});
