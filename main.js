var https = require('https');

var trello = function(key, token) {
  this.key = key;
  this.token = token;
  this.host = "api.trello.com";
};

trello.prototype.params = function(args) {
  var str = "";
  var c = 1;
  for(var i in args) {
    if (c == 1)
      c = 0;
    else
      str += "&";
    str += i + "=" + args[i];
  }
  return str;
};

trello.prototype.get = trello.prototype.api = function(apiCall, args, callback) {
  callback = callback || args;
  args = args || {};
  
  var host = "api.trello.com";
  var options = {
    host: host,
    port: 443,
    path: apiCall,
    method: 'GET'
  };

  if(this.key) {
    args["key"] = this.key;
  }
  if(this.token) {
    args["token"] = this.token;
  }

  options.path += "?" + this.params(args);
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function(d) {
      data += d;
    });
    res.on("end", function() {
      if(res.statusCode !== 200) {
        callback(data);
      } else {
        var j = JSON.parse(data);
        callback(false, j);
      }
    });
  });
  req.end();

  req.on('error', function(e) {
    throw e;
  });
};

exports = module.exports = trello;
