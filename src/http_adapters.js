const express = require('express');

function ExpressRouter(){
  this.router = new express.Router();
}

ExpressRouter.prototype.addRoute = function(newRoute){
  this.router[newRoute.method](newRoute.path, function(req, res){
    var params = Object.assign({}, req.params, req.query);
    newRoute.controller.call({
      services: req.dependencies,
      session: req.session,
      params: params,
      body: req.body
    }, function(err, response){
      if(err){
        return res.status(500).json({
          error: err
        });
      }
      res.status(200).json(response);
    });
  });
};

module.exports = {
  'express': ExpressRouter
};
