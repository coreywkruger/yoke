const express = require('express');
const bodyParser = require('body-parser');
const h = require('@gobold/bold-require')('helper');
const config = h.requireConfig();
const Authentication = require('../lib/authentication');
const PrivateRouter = require('./private_router');
const PublicRouter = require('./public_router');

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
    private: {},
    public: {}
  };
};

App.prototype.registerContext = function(core, name){
  this.app.use(function(req, res, next){
    req.bold[name] = core;
    next();
  });
};

App.prototype.addAuthentication = function(auth){
  this.AuthMiddleware = auth;
};

App.prototype.addPublicRoutes = function(prefix, router, isPrivate){
  this.routers[isPrivate ? 'private' : 'public'][prefix] = router
};

App.prototype.start = function(port, host, cb) {

  this.app.use(function(req, res, next){
    req.bold.myContext.ping((msg) => {
      console.log(msg);
      next();
    });
  });

  for(var key in this.routers.public){
    this.app.use(this.routers.public[key]);
  }

  if(this.AuthMiddleware){
    this.app.use(this.AuthMiddleware);
    for(var key in this.routers.private){
      this.app.use(this.routers.private[key]);
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
