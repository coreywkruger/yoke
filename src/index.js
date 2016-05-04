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
    private: null,
    public: null
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

App.prototype.addAuthenticator = function(auth){
  this.authenticator.setValidationMethod(auth);
};

// App.prototype.setHTTPAdapter = function(adapter){
//   this.adapter = adapter.initialize();
// };

App.prototype.addRoute = function(routes, isPrivate){
  var key = isPrivate ? 'private' : 'public';
  this.routers[key] = new express.Router();
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
  if(this.authenticator.Authenticate){
    this.app.use(this.authenticator.Authenticate);
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
