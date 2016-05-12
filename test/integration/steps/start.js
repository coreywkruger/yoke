const expect = require('chai').expect;

module.exports = function () {
  this.Given(/^a yoke$/, function(cb){
    cb();
  });

  this.When(/^I start$/, function(cb){
    this.app.start('8020', function(){
      cb();
    });
  });

  this.Then(/^it should work$/, function(cb){
    cb();
  });
};
