var CitiesDAO = require('../db.js'),
    Query = require('../flickr.js').Query,
    weather = require('../weather.js');

module.exports = function (connection, flickr, app){

  var cities = new CitiesDAO(connection);

  app.get('/', function (req, res, next){

    cities.getCity(function(err, city){
      if(err) return next(err);

      var query = new Query(city.name);

      flickr.photos.search(query, function (err, docs){
        if(err) return next(err);

        if(docs.photos.photo.length == 0) return res.redirect('/');

        var photos = [];

        for(var i = 0; i < docs.photos.photo.length; i++){
          var photo = docs.photos.photo[i];

          if(!photo) break;

          var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret +'_n.jpg'
          photos[i] = url;
        }

        weather.getWeather(city.name, function (err, data){
          var forecast = [];

          if(data){
            for(var i = 0; i < data.list.length; i++){
              var weather = {}
              weather.main = data.list[i].weather[0].main;
              weather.desc = data.list[i].weather[0].description;
              weather.temp = Math.floor(data.list[i].temp.day - 273);
              forecast[i] = weather;
            }
          }

          res.render('index', {
            city : city.name,
            photos : photos,
            weather : forecast
          });

        });
      });
    });
  });

}
