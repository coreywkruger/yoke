const h = require('@gobold/bold-require')('helper');
const errors = h.requireLib('errors');
const BoldSession = require('@gobold/session');

/*
* is what it be
*/
function Authentication(config) {
  this.session_key_public = config.publicSessionKey;
};

/*
* middleware function that gets the headers and injects the context
*/
Authentication.prototype.Authenticate = function(req, res, next){
  this.ctx = req.bold;
  this.Route(req.headers, function(err, who) {
    if (err) {
      return res.status(err.code).json({
        message: err.message,
        type: err.type
      });
    }
    req.session = who;
    next();
  });
};

/*
* decides which form of authentication to use
*/
Authentication.prototype.Route = function(headers, cb) {
  if (headers['session-key']) {
    this.authSession(headers['session-key'], cb);
  } else {
    cb(new errors.AuthenticationError('Unauthorized'));
  }
};

/*
* Validate session key
*
* 1) decrypts token and 2) validates token
*/
Authentication.prototype.authSession = function(encryptedToken, cb) {
  BoldSession.decryptToken(encryptedToken, this.session_key_public, (err, token) => {
    if (err) {
      return cb(new errors.AuthenticationError('Could not validate session.'));
    }
    if (!BoldSession.validateToken(token) || !token.recipient_id) {
      return cb(new errors.AuthenticationError('Could not validate session.'));
    }
    this.ctx.recipientCore.getRecipientById(token.recipient_id, (getRecipientErr, recipient) => {
      if (getRecipientErr) {
        return cb(new errors.AuthenticationError('Could not authenticate user.'));
      }
      if (recipient === null) {
        return cb(new errors.AuthenticationError('Could not authenticate user.'));
      }
      this.ctx.clientCore.getClientById(recipient.client_id, (getClientErr, client) => {
        if (getClientErr) {
          return cb(new errors.AuthenticationError('Could not authenticate client.'));
        }
        if (client === null) {
          return cb(new errors.AuthenticationError('Could not authenticate client..'));
        }
        cb(null, {
          client: client,
          recipient: recipient
        });
      });
    });
  });
};

module.exports = {
  New: function(config) {
    return new Authentication(config);
  }
};
