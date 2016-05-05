const express = require('express');
const _ = require('lodash');

function ExpressRouter(){
  this.router = new express.Router();
}

ExpressRouter.prototype.addRoute = function(newRoute){
  this.router[newRoute.method](newRoute.path, function(req, res){
    var params = _.assign({}, req.params, req.query);
    newRoute.action.call({
      context: req.context,
      session: req.session,
      params: params,
      body: req.body
    }, function(err, response){
      if(err){
        return res.status(500).json({
          error: err
        });
      }
      res.status(200).json({
        data: response
      });
    });
  });
};

module.exports = {
  'express': ExpressRouter
};
