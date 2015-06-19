
function CitiesDAO(db){

  var cities = db.collection('cities');

  this.getCity = function (fn){
    var rand = Math.random();
    cities.findOne({rnd : {$gte : rand}}, function (err, doc){
      if(err) return fn(err, null);

      fn(null, doc);
    });
  }
}

module.exports = CitiesDAO;
