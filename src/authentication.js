
/*
* is what it be
*/
module.exports = function(req, res, next){
  var auth = new req.context.auth();
  auth.execute(req.headers[req.context.auth_key_name] || '', function(err, who){
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
