## onboarding-api
### Uses @gobold/yoke to bootstrap api

```javascript
// Initialize new yoke
var yoke = new Yoke();

/*
* 1) define header to use for ath; inject authentication method
* 2) choose routing adapter
* 3) add route(s)
*/
yoke.setAuthAdapter('session-key', Auth);
yoke.setHTTPAdapter('express');
yoke.addRoute([{
  method: 'get',
  path: '/ping',
  auth: true,
  action: function(cb){
    cb('pong');
  }
}]);

/*
* start listening on port 8020 on localhost
*/
yoke.start('8020', function(){
  console.log('starting... ')
});
```

### Cores can be initialized, registered, and accessed like so:

```javascript
// Initialize new yoke
var yoke = new Yoke();

/*
* attach new cores
*/
/* client-core */
clientCore.initialize({
  database: config_shenanigans
}, function(err, core){
  
  /* 
  * inject core into controllers
  */
  yoke.registerContext(core, 'clientCore');
  yoke.addRoute([{
    method: 'get',
    path: '/ping',
    action: function(cb){

      /* access core here */
      this.context.clientCore.doThingHere( ... );

      ... 
    }
  }]);

  /* start server */
  yoke.start('8020', function(){
    console.log('starting... ');
  });
});
```