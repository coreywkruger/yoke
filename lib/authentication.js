/*
* is what it be
*/
function Authentication(config) {
  this.header_name = config.header_name;
  this.validataion = function(key, cb){
    cb(null, {});
  }
};

/*
* middleware function that gets the headers and injects the context
*/
Authentication.prototype.Authenticate = function(req, res, next){
  this.context = req.context;
  this.Validate(req.headers[this.header_name], function(err, who) {
    if (err) {
      return res.status(err.code).json({
        message: err.message,
        type: err.type
      });
    }
    req.session = who;
    next();
  });
};

/*
* Validate session key
*
* 1) decrypts token and 2) validates token
*/
Authentication.prototype.Validate = function(key, cb){
  return this.validataion.call(this, key, cb);
};

Authentication.prototype.setValidationMethod = function(cb){
  this.validataion = cb;
};

module.exports = {
  New: function(config) {
    return new Authentication(config);
  }
};
