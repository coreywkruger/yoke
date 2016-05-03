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
    req.bold = BoldContext;
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
};

App.prototype.registerContext = function(core, name){
  this.app.use(function(req, res, next){
    req.bold[name] = core;
    next();
  });
};

App.prototype.start = function(port, host, cb) {

  const auth = Authentication.new({
    session_key_public: config.get('app').session_key
  });

  this.app.use(function(req, res, next){
    req.bold.myContext.ping((msg) => {
      console.log(msg);
      next();
    });
  });
  this.app.use('/', PublicRouter);
  this.app.use(auth.authenticate);
  this.app.use('/', PrivateRouter);
  this.app.use((req, res) => {
    res.sendStatus(404);
  });
  this.server = this.app.listen(port, host, () => {
    cb();
  });
};

module.exports = App;
