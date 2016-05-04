## Yoke
### To ensure equal yokage for all apps and cores

/* import from @gobold */
const Yoke = require('@gobold/yoke');

/* Initialize new yoke */
var yoke = new Yoke();

/* add route(s) */
yoke.addRouter([{
  method: 'get',
  path: '/ping',
  action: function(cb){
    cb('pong');
  }
}]);

/*
* start listening on port 8020 on localhost
*/
yoke.start('8020', '127.0.0.1', function(){
  console.log('starting... ')
});