const request = require('supertest')('http://localhost:8889');
const Yoke = require('../../dist');

const beforeHooks = function () {

  this.Before(function (scenario, next) {

    this.app = new Yoke();
    this.app.addCore('myCore', function(done){
      done(null, {
        ping: function(){
          return 'pong';
        }
      });
    });
    /*
    * 1) choose auth adapter; set auth method and key
    * 2) choose routing adapter
    * 3) add route(s)
    */
    this.app.setHTTPAdapter('express');

    /* login route */
    this.app.addRoutes([{
      method: 'post',
      path: '/ping',
      controller: function(cb){
        cb(null, {});
      }
    }]);

    /* start listening on port 8020 */
    this.app.start('8020', function(){
      console.log('start app');
      next();
    });
  });
};

module.exports = beforeHooks;
