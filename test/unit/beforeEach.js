const Yoke = require('../../dist');

const beforeHooks = function () {

  this.Before(function (scenario, next) {
    this.app = new Yoke();
    this.app.setHTTPAdapter('express');
    next();
  });
};

module.exports = beforeHooks;
