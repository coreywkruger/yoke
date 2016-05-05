
/*
* is what it be
*/
module.exports = function(req, res, next){
  req.context.auth(req.headers[req.context.auth_header] || '', function(err, who){
    if(err){
      return res.status(500).send(err);
    }
    req.session = who;
    next();
  });
};
