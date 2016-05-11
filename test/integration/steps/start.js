const request = require('supertest')('http://localhost:8889');
const expect = require('chai').expect;

module.exports = function () {
  this.Given(/^a yoke$/, function(cb){
    cb();
  });

  this.When(/^I start$/, function(cb){
    cb();
  });

  this.Then(/^it should work$/, function(cb){
    cb();
  });
};
