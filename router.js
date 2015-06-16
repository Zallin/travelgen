var urls = {};

var addHandlers = function (url, method, handlers){
  if(!urls[url]) urls[url] = {};

  var list = urls[url];

  if(!list[method]) list[method] = [];

  handlers.forEach(function (el){
    list[method].push(el);
  });
}

function initNext(handlers, req, res){
  var depth = 0;

  function n(){
    var func = handlers[depth];
    depth++;

    func(req, res, n);
  }

  return n;
}

module.exports = {
    get : function (url){
      addHandlers(url, 'GET', Array.prototype.slice.call(arguments, 1));
    },

    post : function (url){
      addHandlers(url, 'POST', Array.prototype.slice.call(arguments, 1));
    },

    handler : function (req, res){
      var list = urls[req.url] || [];

      var handlers = list[req.method] || [];

      if(handlers[0]){
        var next = initNext(handlers, req, res);
        next();
      }
    }
}
