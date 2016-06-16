const express = require('express');
const bodyParser = require('body-parser');
const HTTPAdapters = require('./http_adapters');
const AuthAdapters = require('./auth_adapters');
const Injector = require('./injector').Injector;

var App = function() {
  this.app = express();
  this.routers = {};
  this.allowedHeaders = ['X-Requested-With', 'Content-Type', 'Access-Control-Allow-Credentials'];
  this.allowedMethods = ['GET', 'PUT', 'POST', 'DELETE'];
  this.app.disable('x-powered-by');
  this.app.use(bodyParser.urlencoded({
    extended: false
  }));
  this.app.use(bodyParser.json());
  this.injector = new Injector();
  this.app.use(function(req, res, next){
    req.session = {};
    next();
  });

  var allowedHeaders = this.allowedHeaders;
  var allowedMethods = this.allowedMethods;
  // headers
  this.app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', allowedMethods.join(','));
    res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
    next();
  });
};

App.prototype.addCore = function(name, cb){
  this.injector.add(name, cb);
};

App.prototype.setAuthAdapter = function(adapterName, args, authenticate){
  this.Auth = new AuthAdapters[adapterName](this, args, authenticate);
};

App.prototype.setHTTPAdapter = function(adapterName){
  this.routers.public = new HTTPAdapters[adapterName]();
  this.routers.private = new HTTPAdapters[adapterName]();
};

App.prototype.addRoutes = function(routes){
  for(var i = 0 ; i < routes.length ; i++){
    this.routers[routes[i].auth ? 'private' : 'public'].addRoute(routes[i]);
  }
};

App.prototype.start = function(port, cb) {
  this.injector.ready().then(() => {
    var inj = this.injector;
    this.app.use(function(req, res, next){
      req.dependencies = inj;
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
    if(this.routers.public){
      this.app.use(this.routers.public.router);
    }
    if(this.Auth){
      this.app.use(this.Auth.authenticate());
      if(this.routers.private){
        this.app.use(this.routers.private.router);
      }
    }
    this.app.use((req, res) => {
      res.sendStatus(404);
    });
    this.server = this.app.listen(port, () => {
      if(cb) {
        cb();
      }
    });
  });
};

App.prototype.kill = function(cb){
  this.server.close(cb);
};

module.exports = App;
