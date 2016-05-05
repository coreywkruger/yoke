const express = require('express');

function ExpressRouter(){
  this.router = new express.Router();
}

ExpressRouter.prototype.addRoute = function(newRoute){
  if(newRoute instanceof Array){
    for(var i = 0 ; i < newRoute.length ; i++){
      var route = newRoute[i];
      this.router[route.method](route.path, function(req, res, next){
        route.action.call({
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
    }
  } else {
    this.router[newRoute.method](newRoute.path, function(req, res, next){
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
  }
};

module.exports = {
  'express': ExpressRouter
}