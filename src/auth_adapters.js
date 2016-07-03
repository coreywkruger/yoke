
function HeaderAuthAdapter(context, header, method){
  this.header = header;
  this.method = method;
  context.allowedHeaders.push(header);
}

HeaderAuthAdapter.prototype.authenticate = function(){
  var auth = this.method;
  var header = this.header;
  return function(req, res, next){
    auth.call({
      services: req.dependencies
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
