const expect = require('chai').expect;

module.exports = function () {

  this.Given(/^a core named (.*) with method "(.*)" that returns "(.*)"$/, function(coreName, method, response, cb){
    this.app.addCore(coreName, function(done){
      var core = {};
      core[method] = ping => response;
      done(null, core);
    });
    cb();
  });

  this.Given(/^a "(.*)" route with "(.*)" method @ "(.*)" with a controller that uses core (.*)$/, function(auth, method, path, coreName, cb){
    this.app.addRoutes([{
      method: method,
      path: path,
      auth: auth === 'private' ? true : false,
      controller: function(callback){
        callback(null, this.cores.get(coreName).ping());
      }
    }]);
    this.app.start(this.port, () => {
      this.req = this.request.get(path);
      cb();
    });
  });

  this.Then(/^the response should contain "(.*)"$/, function(response, cb){
    expect(this.response.body).to.be.equal(response);
    cb();
  });
};
