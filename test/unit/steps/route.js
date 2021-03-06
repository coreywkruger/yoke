const expect = require('chai').expect;

module.exports = function () {
  this.Given(/^a route with "(.*)" method @ "(.*)"$/, function(method, path, cb){
    this.app.addRoutes([{
      method: method,
      path: path,
      controller: function(callback){
        callback(null, {ping: 'pong'});
      }
    }]);
    cb();
  });

  this.When(/^I "(.*)" @ "(.*)"$/, function(method, path, cb){
    this.req = this.request[method](path);
    this.req.end((err, response) => {
      expect(err).to.be.null;
      this.response = response;
      cb();
    });
  });

  this.When(/^I "(.*)" @ "(.*)" with header$/, function(method, path, cb){
    this.req = this.request[method](path);
    this.req.set('ping', 'pong');
    this.req.end((err, response) => {
      expect(err).to.be.null;
      this.response = response;
      cb();
    });
  });

  this.Then(/^the statusCode should be ok$/, function(cb){
    expect(this.response.statusCode).to.equal(200);
    cb();
  });

  this.Then(/^the statusCode should not be ok$/, function(cb){
    expect(this.response.statusCode).to.not.equal(200);
    cb();
  });
};
