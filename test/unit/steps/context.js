const Yoke = require('../../../dist');
const expect = require('chai').expect;

module.exports = function () {
  this.Given(/^a yoke$/, function(cb){
    this.request = require('supertest')('http://localhost:'+this.port);
    this.app = new Yoke();
    cb();
  });

  this.Given(/^a (.*) http adapter$/, function(httpType, cb){
    this.app.setHTTPAdapter(httpType);
    cb();
  });

  this.Given(/^a (.*) auth adapter$/, function(authType, cb){
    this.app.useHeaderAuth('ping', function(header, callback){
      if(header !== 'pong') {
        return callback('failed auth');
      }
      callback(null, {
        who: 'me'
      });
    });
    cb();
  });

  this.Given(/^a route with "(.*)" method @ "(.*)" with a controller$/, function(method, path, cb){
    this.app.addRoutes([{
      method: method,
      path: path,
      controller: function(callback){
        callback(null, {
          session: this.session,
          body: this.body,
          params: this.params,
          services: this.services
        });
      }
    }]);
    cb();
  });

  this.Then(/^the response should have a core named (.*)$/, function(name, cb){
    expect(this.response.body.services.get(name)).to.not.be.undefined;
    cb();
  });

  this.Then(/^the response should have a session (.*) equal to (.*)$/, function(key, value, cb){
    expect(this.response.body.session[key]).to.equal(value);
    cb();
  });

  this.Then(/^the response should have a param (.*) equal to (.*)$/, function(key, value, cb){
    expect(this.response.body.params[key]).to.equal(value);
    cb();
  });

  this.Then(/^the response should have a body field (.*) equal to (.*)$/, function(key, value, cb){
    expect(this.response.body.body[key]).to.equal(value);
    cb();
  });

  this.When(/^I listen on port {(.*)}$/, function(port, cb){
    this.app.start(port, err => {
      expect(err).to.be.null;
      cb();
    });
  });

  this.When(/^I post @ "(.*)" with body and querystring$/, function(path, cb){
    this.req = this.request.post(path+'?query=pong');
    this.req.send({
      ping: 'pong'
    });
    this.req.end((err, response) => {
      expect(err).to.be.null;
      this.response = response;
      cb();
    });
  });

  this.When(/^I post @ "(.*)" with body, querystring, and header$/, function(path, cb){
    this.req = this.request.post(path+'?query=pong');
    this.req.set('ping', 'pong');
    this.req.send({
      ping: 'pong'
    });
    this.req.end((err, response) => {
      expect(err).to.be.null;
      this.response = response;
      cb();
    });
  });
};
