### @gobold/yoke

###Bootstrap an API
```javascript
// Initialize new yoke
var yoke = new Yoke();

// 1) choose auth adapter; set auth method and key
// 2) choose routing adapter
// 3) add route(s)
// authentication
yoke.useHeaderAuth('some-new-header', someAuthMethod);

// http routing adapter
yoke.setHTTPAdapter('express');

// add routes
yoke.addRoutes([{
  method: 'get',
  path: '/ping',
  auth: true,
  controller: function(cb){
    /*
    * this.session = ...
    * this.body = ...
    * this.params = ...
    * this.services = ...
    */
    cb(null, 'response: pong');
  }
}]);

// someLogger.info( /* info stuff */ )
// someLogger.Error( /* error stuff */ )
// etc...
yoke.setLogger(someLogger);

// start listening on port 8020 on localhost
yoke.start('8020', function(err){
  console.log('starting... ')
});
```

### Dependencies can be initialized and injected like so:

```javascript
// promise
yoke.inject('PromiseService', PromiseService.then(res => {
  /* do stuff */
  return res;
}));
// callback
yoke.inject('CallbackService', callback => {
  /* get callback service */
  callback(null, CallbackService);
});
// value
yoke.inject('Value', Value);

// dependencies are injected into controller scope
yoke.addRoutes([{
  method: 'get',
  path: '/ping',
  controller: function(cb){

    // use injected dependencies inside controller
    this.services.someInjectedService.doThing( /* do thing */ );
  }
}]);

// start listening
yoke.start('8020', function(){
  console.log('starting... ');
});
```