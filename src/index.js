const express = require('express');
const bodyParser = require('body-parser');
const Authentication = require('../lib/authentication');

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
    private: [],
    public: []
  };
  this.authenticator = Authentication.New({
    header_name: 'session-key'
  });
};

App.prototype.registerContext = function(core, name){
  this.app.use(function(req, res, next){
    req.context[name] = core;
    next();
  });
};

App.prototype.addAuthentication = function(auth){
  this.authenticator.setValidationMethod(auth);
};

App.prototype.addRouter = function(routes, isPrivate){
  this.routers[isPrivate ? 'private' : 'public'].push(function(){
    var router = new express.Router();
    for(var i = 0 ; i < routes.length ; i++){
      var route = routes[i];
      router[route.method](route.path, function(req, res, next){
        route.action.call({
          req: req
        }, function(err){
          next(err);
        });
      });
    }
    return router;
  }());
};

App.prototype.start = function(port, host, cb) {
  for(var i = 0 ; i < this.routers.public.length ; i++){
    this.app.use(this.routers.public[i]);
  }

  if(this.AuthMiddleware){
    for(var key in this.authenticators){
      this.app.use(this.authenticators[key]);
    }
    for(var i = 0 ; i < this.routers.private.length ; i++){
      this.app.use(this.routers.private[i]);
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
