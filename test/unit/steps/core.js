const expect = require('chai').expect;

module.exports = function () {

  this.Given(/^a \(callback\) core named (.*) with method {(.*)} that returns {(.*)}$/, function(coreName, method, response, cb){
    this.app.inject(coreName, function(done){
      var core = {};
      core[method] = ping => response;
      done(null, core);
    });
    cb();
  });

  this.Given(/^a \(promise\) core named (.*) with method {(.*)} that returns {(.*)}$/, function(coreName, method, response, cb){
    var newCore = new Promise(resolve => {
      var core = {};
      core[method] = ping => response;
      resolve(core);
    });
    this.app.inject(coreName, newCore);
    cb();
  });

  this.Given(/^a "(.*)" route with "(.*)" method @ "(.*)" with a controller that uses core (.*)$/, function(auth, method, path, coreName, cb){
    this.app.addRoutes([{
      method: method,
      path: path,
      auth: auth === 'private' ? true : false,
      controller: function(callback){
        callback(null, this.services[coreName].ping());
      }
    }]);
    this.app.start(this.port, err => {
      expect(err).to.be.null;
      this.req = this.request.get(path);
      cb();
    });
  });

  this.Then(/^the response should contain "(.*)"$/, function(response, cb){
    expect(this.response.body).to.be.equal(response);
    cb();
  });
};
