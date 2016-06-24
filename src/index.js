const express = require('express');
const bodyParser = require('body-parser');
const HTTPAdapters = require('./http_adapters');
const AuthAdapters = require('./auth_adapters');
const Injector = require('./injector').Injector;

var App = function() {
  this.routers = {};
  this.injector = new Injector();
  this.allowedHeaders = ['X-Requested-With', 'Content-Type', 'Access-Control-Allow-Credentials'];
  this.allowedMethods = ['GET', 'PUT', 'POST', 'DELETE'];
  this.app = express();
  this.app.disable('x-powered-by');

};

// adds a dependency
// injects dependency into controllers
App.prototype.addCore = function(name, cb){
  this.injector.add(name, cb);
};

// sets adapter for authentication
App.prototype.setAuthAdapter = function(adapterName, args, authenticate){
  this.Auth = new AuthAdapters[adapterName](this, args, authenticate);
};

// sets adapter for http requests
// translates params into controller scope
App.prototype.setHTTPAdapter = function(adapterName){
  this.routers.public = new HTTPAdapters[adapterName]();
  this.routers.private = new HTTPAdapters[adapterName]();
};

// injects logger
App.prototype.setLogger = function(logger){
  this.logger = logger;
};

// appends routes to either public or private routers
App.prototype.addRoutes = function(routes){
  for(var i = 0 ; i < routes.length ; i++){
    this.routers[routes[i].auth ? 'private' : 'public'].addRoute(routes[i]);
  }
};

// starts yoke server
App.prototype.start = function(port, cb) {
  this.injector.ready().then(() => {

    // headers and deps
    var allowedHeaders = this.allowedHeaders
      , allowedMethods = this.allowedMethods
      , injector = this.injector;

    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(bodyParser.json());
    this.app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', allowedMethods.join(','));
      res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
      next();
    });

    this.app.use(function(req, res, next){
      req.dependencies = injector;
      next();
    });

    // inject logger
    if(this.logger){
      var logger = this.logger;
      this.app.use(function(req, res, next){
        req.logger = logger;
        req.logger.info(req.method, req.path);
        next();
      });
    }

    // return 200 for options method
    this.app.use(function(req, res, next){
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // public routes
    if(this.routers.public){
      this.app.use(this.routers.public.router);
    }

    // authentication for private routes
    if(this.Auth){
      this.app.use(this.Auth.authenticate());
      if(this.routers.private){
        this.app.use(this.routers.private.router);
      }
    }

    // if nothing is found
    this.app.use((req, res) => {
      res.sendStatus(404);
    });

    // start server
    this.server = this.app.listen(port, () => {
      if(cb) {
        cb();
      }
    });
  });
};

// kill yoke server
App.prototype.kill = function(cb){
  this.server.close(cb);
};

module.exports = App;
