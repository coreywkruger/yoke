
/*
* is what it be
*/
module.exports = function(req, res, next){
  req.context.auth.Execute(req.headers[req.context.auth.headerName] || '', function(err, who){
    if(err){
      return res.status(500).send(err);
    }
    req.session = who;
    next();
  });
};
