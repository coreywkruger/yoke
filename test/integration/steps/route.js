const request = require('supertest')('http://localhost:8020');
const expect = require('chai').expect;

module.exports = function () {
  this.Given(/^a public route$/, function(cb){
    cb();
  });

  this.Given(/^a private route$/, function(cb){
    cb();
  });

  this.When(/^I call it without credentials$/, function(cb){
    request
      .get('/public/ping')
      .end((err, res) => {
        this.err = err;
        this.res = res;
        cb();
      });
  });


  this.When(/^I call the private route it with credentials$/, function(cb){
    request
      .get('/public/ping')
      .set('ping', 'pong')
      .end((err, res) => {
        this.err = err;
        this.res = res;
        cb();
      });
  });


  this.When(/^I call the private route without credentials$/, function(cb){
    request
      .get('/private/ping')
      .end((err, res) => {
        this.err = err;
        this.res = res;
        cb();
      });
  });

  this.Then(/^I should receive a response body$/, function(cb){
    expect(this.err).to.be.null;
    cb();
  });

  this.Then(/^I should receive an error from the API$/, function(cb){
    expect(this.res.statusCode).to.not.equal(200);
    cb();
  });
};
