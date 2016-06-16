
function HeaderAuthAdapter(context, header, method){
  this.header = header;
  this.method = method;
  context.app.use(function(req, res, next){
    context.allowedHeaders.push(header);
    res.header('Access-Control-Allow-Headers', context.allowedHeaders.join(','));
    next();
  });
}

HeaderAuthAdapter.prototype.authenticate = function(){
  var auth = this.method;
  var header = this.header;
  return function(req, res, next){
    auth.call({
      cores: req.dependencies
    }, req.headers[header], function(err, who){
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
