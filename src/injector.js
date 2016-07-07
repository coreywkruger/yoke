import Promise from 'bluebird';

export var Injector = function() {
  this.servicePromises = [];
  this.services = {};
};

// Add named service
Injector.prototype.inject = function(name, service) {

  // Create promise so we can later determine if the injector is ready
  var servicePromises = new Promise((resolve, reject) => {

    if (this.services[name]) {
      reject(new Error(name+' already is defined'));
    }

    if(service.then && service.catch){
      service
        .then(result => {
          // Set service
          this.services[name] = result;
          resolve(result);
          return Promise.resolve(result);
        })
        .catch(err => {
          err.message = name + ' failed to resolve. ' + err.message;
          reject(err);
          return Promise.reject(err);
        });
    } else if (typeof service === 'function') {
      service((err, result) => {
        if (err) {
          err.message = name + ' failed to resolve. ' + err.message;
          reject(err);
        }
        // Set service
        this.services[name] = result;
        resolve(result);
      });
    } else {
      this.services[name] = service;
      resolve(service);
    }
  });

  this.servicePromises.push(servicePromises);
};

Injector.prototype.getInjections = function(){
  return this.services;
};

// Return a promise that is fullfilled when all services are ready
Injector.prototype.ready = function() {
  return Promise.Promise.all(this.servicePromises);
};
