import Bluebird from 'bluebird';

export var Injector = function() {
  this.servicePromises = [];
  this.services = {};
};

// Add named service
Injector.prototype.add = function(name, cb) {

  // Must have unique services
  if (this.services[name]) {
    console.log(name, ' already is defined');
    process.exit(1);
  }

  // Create promise so we can later determine if the injector is ready
  var servicePromise = new Bluebird((resolve) => {
    cb((err, result) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      // Set service
      this.services[name] = result;
      resolve(result);
    });
  });

  this.servicePromises.push(servicePromise);
};

// Get named service
Injector.prototype.get = function(name) {
  return this.services[name];
};

// Return a promise that is fullfilled when all services are ready
Injector.prototype.ready = function() {
  return Bluebird.Promise.all(this.servicePromises);
};
