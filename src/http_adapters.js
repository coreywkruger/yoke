const express = require('express');
const _ = require('lodash');

function ExpressRouter(){
  this.router = new express.Router();
}

ExpressRouter.prototype.addRoute = function(newRoute){
  this.router[newRoute.method](newRoute.path, function(req, res){
    var params = Object.assign({}, req.params, req.query);
    newRoute.controller.call({
      services: req.services,
      session: req.session,
      params: params,
      body: req.body
    }, function(err, response){
      if(err){
        var statuscode = (_.has(err, 'code')) ? err.code : 500;
        return res.status(statuscode).json({
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
