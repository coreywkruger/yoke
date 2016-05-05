## onboarding-api
### Uses @gobold/yoke to bootstrap api

```javascript
// Initialize new yoke
var yoke = new Yoke();

/* 
* inject authentication adapter
*/
yoke.setAuthAdapter(new Auth({
  headerName: 'session-key',
  publicKey: 'FJLAkdKJFHklJHFSDLjkdsjks'
}));

/*
* choose routing adapter
* add route(s)
* the array can have as many routes as you want
*/
yoke.setHTTPAdapter('express');
yoke.addRoute([{
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
  * register context
  * injects cores into controllers 
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
  yoke.start('8020', '127.0.0.1', function(){
    console.log('starting... ');
  });
});
```