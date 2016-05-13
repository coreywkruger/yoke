const request = require('supertest')('http://localhost:8020');
const expect = require('chai').expect;

module.exports = function () {
  this.Given(/^a yoke$/, function(cb){
    cb();
  });

  this.Given(/^an auth adapter$/, function(cb){
    this.app.setAuthAdapter('header', 'ping', function(header, callback){      
      if(header !== 'pong') {
        return callback('failed auth');
      }
      callback(null, {
        who: 'me'
      });
    });
    cb();
  });

  this.Given(/^a public route with a controller$/, function(cb){
    this.app.addRoutes([{
      method: 'post',
      path: '/public/:ping',
      controller: function(callback){
        var allowedAttributes = ['cores', 'params', 'session', 'body'];
        var len = 0;
        for(var key in this){
          len++;
          expect(this[key]).to.not.be.undefined;
        }
        expect(len).to.equal(allowedAttributes.length);
        expect(this.session.who).to.be.undefined;
        expect(this.params.ping).to.equal('pong');
        expect(this.params.query).to.equal('pong');
        callback();
      }
    }]);
    cb();
  });

  this.Given(/^a private route with a controller$/, function(cb){
    this.app.addRoutes([{
      method: 'post',
      path: '/private/:ping',
      auth: true,
      controller: function(callback){
        var allowedAttributes = ['cores', 'params', 'session', 'body'];
        var len = 0;
        for(var key in this){
          len++;
          expect(this[key]).to.not.be.undefined;
        }
        expect(len).to.equal(allowedAttributes.length);
        expect(this.session.who).to.equal('me');
        expect(this.params.ping).to.equal('pong');
        expect(this.params.query).to.equal('pong');
        callback();
      }
    }]);
    cb();
  });

  this.Given(/^a new core$/, function(cb){
    this.app.addCore('myCore', function(done){
      done(null, {
        ping: () => 'core response'
      });
    });
    cb();
  });

  this.When(/^I start yoke$/, function(cb){
    this.app.start('8020', () => {
      cb();
    });
  });

  this.When(/^call the public route$/, function(cb){
    this.req = request.post('/public/pong?query=pong');
    this.req.send({
      ping: 'pong'
    });
    cb();
  });

  this.When(/^call the private route$/, function(cb){
    this.req = request.post('/private/pong?query=pong');
    this.req.set('ping', 'pong');
    this.req.send({
      ping: 'pong'
    });
    cb();
  });

  this.Then(/^the context should be formated correctly$/, function(cb){
    this.req.end((err, response) => {
      expect(err).to.be.null;
      expect(response.statusCode).to.equal(200);
      cb();
    });
  });
};
