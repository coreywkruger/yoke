const express = require('express');
const bodyParser = require('body-parser');
const Authentication = require('./authentication');

var BoldContext = {};

var App = function() {
  this.app = express();
  this.app.disable('x-powered-by');
  this.app.use(bodyParser.urlencoded({
    extended: false
  }));
  this.app.use(bodyParser.json());
  this.app.use(function(req, res, next){
    req.session = {};
    req.context = BoldContext;
    next();
  });
  // headers
  this.app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, session-key');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  this.routers = {
    private: new express.Router(),
    public: new express.Router()
  };
};

App.prototype.registerContext = function(core, name){
  this.app.use(function(req, res, next){
    req.context[name] = core;
    next();
  });
};

App.prototype.setAuthentication = function(key_name, auth){
  this.useAuth = true;
  this.app.use(function(req, res, next){
    req.context.authenticator_key_name = key_name;
    req.context.authenticator = auth;
    next();
  });
};

// App.prototype.setHTTPAdapter = function(adapter){
//   this.adapter = adapter.initialize();
// };

App.prototype.addRoute = function(routes, isPrivate){
  var key = isPrivate ? 'private' : 'public';
  for(var i = 0 ; i < routes.length ; i++){
    var route = routes[i];
    this.routers[key][route.method](route.path, function(req, res, next){
      route.action.call({
        req: req
      }, function(err){
        next(err);
      });
    });
  }
};

App.prototype.start = function(port, host, cb) {
  if(this.routers.public){
    this.app.use(this.routers.public);
  }
  if(this.useAuth){
    this.app.use(Authentication);
    if(this.routers.private){
      this.app.use(this.routers.private);
    }
  }
  this.app.use((req, res) => {
    res.sendStatus(404);
  });
  this.server = this.app.listen(port, host, () => {
    cb();
  });
};

module.exports = App;
