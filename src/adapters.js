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
          context: req.context
        }, function(err){
          next(err);
        });
      });
    }
  } else {
    this.router[newRoute.method](newRoute.path, function(req, res, next){
      newRoute.action.call({
        context: req.context
      }, function(err){
        next(err);
      });
    });
  }
};

module.exports = {
  'express': ExpressRouter
}