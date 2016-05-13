const request = require('supertest')('http://localhost:8020');
const expect = require('chai').expect;

module.exports = function () {

  this.Given(/^a core$/, function(cb){
    this.app.addCore('myCore', function(done){
      done(null, {
        ping: () => 'core response'
      });
    });
    cb();
  });

  this.Given(/^a public route with a controller that uses that core$/, function(cb){
    this.app.addRoutes([{
      method: 'get',
      path: '/ping',
      controller: function(callback){
        callback(null, {
          ping: this.cores.get('myCore').ping()
        });
      }
    }]);
    this.app.start('8020', () => {
      this.req = request.get('/ping');
      cb();
    });
  });

  this.Given(/^a private route with a controller that uses that core$/, function(cb){
    this.app.addRoutes([{
      method: 'get',
      path: '/ping',
      controller: function(callback){
        callback(null, {
          ping: this.cores.get('myCore').ping()
        });
      }
    }]);
    this.app.start('8020', () => {
      this.req = request.get('/ping');
      cb();
    });
  });

  this.When(/^I call the route that uses cores$/, function(cb){
    this.req.end((err, response) => {
      expect(err).to.be.null;
      this.response = response;
      cb();
    });
  });

  this.Then(/^the route's controller should be able to execute the core's methods$/, function(cb){
    cb();
  });

  this.Then(/^I should receive a response with content from the core$/, function(cb){
    expect(this.response.statusCode).to.equal(200);
    expect(this.response.body.ping).to.equal('core response');
    cb();
  });
};
