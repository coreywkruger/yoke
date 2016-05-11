const request = require('supertest')('http://localhost:8889');
const Yoke = require('../../dist');

const afterHooks = function () {

  this.After(function () {
  	console.log('done');
    // this.app.kill();
  });
};

module.exports = afterHooks;