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
    this.app.setAuthAdapter('header', 'ping', function(header, cb){
      if(header !== 'pong'){
        return cb('failed auth');
      }
      cb(null, header);
    });

    this.app.setHTTPAdapter('express');

    /* routes */
    this.app.addRoutes([{
      method: 'get',
      path: '/public/ping',
      controller: function(cb){
        cb(null, {
          ping: 'public'
        });
      }
    }]);
    this.app.addRoutes([{
      method: 'get',
      path: '/private/ping',
      auth: true,
      controller: function(cb){
        cb(null, {
          'ping': 'private'
        });
      }
    }]);

    /* start listening on port 8020 */
    this.app.start('8020', function(){
      next();
    });
  });
};

module.exports = beforeHooks;
