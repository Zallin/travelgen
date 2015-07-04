var http = require('http'),
    utils = require('./utils.js');

exports.getWeather = function (city, fn){

  var uri = encodeURIComponent(city);

  var opts = {
    hostname : 'api.openweathermap.org',
    path : '/data/2.5/forecast/daily?cnt=5&q=' + uri,
    method : 'GET'
  }

  var cache = '';

  var req = http.request(opts, function (res){
    res.on('data', function (chunk){
      cache += chunk.toString();
    });

    res.on('end', function (){
      if(utils.isValidJson(cache)){
        var data = JSON.parse(cache);
        if(data.cod === "200") return fn(null, data);
      }

      fn(new Error(), null);
    });

    res.on('error', function (e){
      fn(new Error(e.message), null);
    });
  });

  req.end();
}
