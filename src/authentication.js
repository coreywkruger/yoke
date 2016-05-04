
/*
* is what it be
*/
module.exports = function(req, res, next){
  var auth = req.context.authenticator(req.headers[this.context.authenticator.key_name],
    function(err, who){
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
