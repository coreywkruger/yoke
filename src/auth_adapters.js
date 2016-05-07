
function HeaderAuthAdapter(headerName, method){
  this.header = headerName;
  this.method = method;
}

HeaderAuthAdapter.prototype.authenticate = function(){
  var auth = this.method;
  var header = this.header;
  return function(req, res, next){
    res.header('Access-Control-Allow-Headers', header);
    auth.call(req, req.headers[header], function(err, who){
      if(err){
        return res.status(500).send(err);
      }
      req.session = who;
      next();
    });
  };
};

module.exports = {
  'header': HeaderAuthAdapter
};
