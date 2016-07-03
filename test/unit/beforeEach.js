const argv = require('yargs').argv;

const beforeHooks = function () {

  this.Before(function (scenario, next) {
    this.port = argv.port;
    next();
  });
};

module.exports = beforeHooks;
