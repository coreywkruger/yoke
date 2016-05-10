## onboarding-api
### Uses @gobold/yoke to bootstrap api

###Bootstrap an API
```javascript
// Initialize new yoke
var yoke = new Yoke();

/*
* 1) choose auth adapter; set auth method and key
* 2) choose routing adapter
* 3) add route(s)
*/
yoke.setAuthAdapter('header', 'some-header-name', someAuthMethod);
yoke.setHTTPAdapter('express');
yoke.addRoute([{
  method: 'get',
  path: '/ping',
  auth: true,
  controller: function(cb){
    cb(null, 'pong');
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
yoke.addCore('clientCore', function(done){
  clientCore.initialize({
    database: config.get('database')['payout_'+config.get('APP_ENV')]
  }, function(err, core){
    ...
    done(null, core);
  });
});
  
/* 
* inject core into controllers
*/
yoke.addRoute([{
  method: 'get',
  path: '/ping',
  controller: function(cb){
    /* 
    * use core inside controller 
    */
    this.core('clientCore').doThingHere( ... );
  }
}]);

/* start server */
yoke.start('8020', function(){
  console.log('starting... ');
});
```