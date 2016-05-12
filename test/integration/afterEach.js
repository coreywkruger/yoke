const request = require('supertest')('http://localhost:8889');
const Yoke = require('../../dist');

const afterHooks = function () {

  this.After(function (scenario, next) {
    this.app.kill(function(){
      next();
    });
  });
};

module.exports = afterHooks;
