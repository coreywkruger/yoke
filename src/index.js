const express = require('express');
const bodyParser = require('body-parser');
const Authentication = require('./authentication');
const HTTPAdapters = require('./http_adapters');

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
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  this.routers = {};
};

App.prototype.registerContext = function(core, name){
  this.app.use(function(req, res, next){
    req.context[name] = core;
    next();
  });
};

App.prototype.setAuthAdapter = function(header, auth){
  this.useAuth = true;
  this.app.use(function(req, res, next){
    res.header('Access-Control-Allow-Headers', header);
    req.context.auth_header = header;
    req.context.auth = auth.bind(req);
    next();
  });
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
  if(this.routers.public){
    this.app.use(this.routers.public.router);
  }
  if(this.useAuth){
    this.app.use(Authentication);
    if(this.routers.private){
      this.app.use(this.routers.private.router);
    }
  }
  this.app.use((req, res) => {
    res.sendStatus(404);
  });
  this.server = this.app.listen(port, () => {
    cb();
  });
};

module.exports = App;
