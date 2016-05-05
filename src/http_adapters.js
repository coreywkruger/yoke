const express = require('express');

function ExpressRouter(){
  this.router = new express.Router();
}

ExpressRouter.prototype.addRoute = function(newRoute){
  this.router[newRoute.method](newRoute.path, function(req, res){
    newRoute.action.call({
      context: req.context,
      session: req.session
    }, function(err, response){
      if(err){
        return res.status(500).send(err);
      }
      res.status(200).send(JSON.stringify({
        data: response
      }));
    });
  });
};

module.exports = {
  'express': ExpressRouter
};
