const request = require('supertest')('http://localhost:8889');
const Yoke = require('../../dist');

const beforeHooks = function () {

  this.Before(function () {

    this.app = new Yoke();
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
	  console.log('starting... ');
	});
  });
};

module.exports = beforeHooks;