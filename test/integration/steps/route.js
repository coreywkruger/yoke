const request = require('supertest')('http://localhost:8020');
const expect = require('chai').expect;

module.exports = function () {
  this.Given(/^a public route$/, function(cb){
    this.app.addRoutes([{
      method: 'get',
      path: '/public/ping',
      controller: function(callback){
        callback(null, {ping: 'public'});
      }
    }]);
    this.app.start('8020', () => {
      this.req = request.get('/public/ping');
      cb();
    });
  });

  this.Given(/^a private route$/, function(cb){
    this.app.setAuthAdapter('header', 'ping', function(header, callback){      
      if(header !== 'pong') {
        return callback('failed auth');
      }
      callback(null, header);
    });
    this.app.addRoutes([{
      method: 'get',
      auth: true,
      path: '/private/ping',
      controller: function(callback){
        callback(null, {ping: 'private'});
      }
    }]);
    this.app.start('8020', () => {
      this.req = request.get('/private/ping');
      cb();
    });
  });

  this.When(/^I call route without credentials$/, function(cb){
    this.req.end((err, response) => {
      expect(err).to.be.null;
      this.response = response;
      cb();
    });
  });

  this.When(/^I call route with credentials$/, function(cb){
    this.req
    .set('ping', 'pong')
    .end((err, response) => {
      expect(err).to.be.null;
      this.response = response;
      cb();
    });
  });

  this.Then(/^I should receive a response body$/, function(cb){
    expect(this.response.body).to.not.be.null;
    cb();
  });

  this.Then(/^I should not get status code 200$/, function(cb){
    expect(this.response.statusCode).to.not.equal(200);
    cb();
  });

  this.Then(/^I should get status code 200$/, function(cb){
    expect(this.response.statusCode).to.equal(200);
    cb();
  });
};
