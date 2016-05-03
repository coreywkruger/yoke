const h = require('@gobold/bold-require')('helper');
const errors = h.requireLib('errors');
// const logger = h.requireLib('logger').logger;
const BoldSession = require('@gobold/session');

/*
* is what it be
*/
function Authentication(config) {
  this.session_key_public = config.publicSessionKey;
};

/*
* decides which form of authentication to use
*/
function Authenticate(headers, cb) {
  if (headers['session-key']) {
    authSession.call(this, headers['session-key'], cb);
  } else {
    cb(new errors.AuthenticationError('Unauthorized'));
  }
};

/*
* Validate session key
*
* 1) decrypts token and 2) validates token
*/
function authSession(encryptedToken, cb) {
  BoldSession.decryptToken(encryptedToken, this.session_key_public, (err, token) => {
    if (err) {
      return cb(new errors.AuthenticationError('Could not validate session.'));
    }
    if (!BoldSession.validateToken(token) || !token.recipient_id) {
      return cb(new errors.AuthenticationError('Could not validate session.'));
    }
    this.clientCore.getRecipientById(token.recipient_id, (getRecipientErr, recipient) => {
      if (getRecipientErr) {
        return cb(new errors.AuthenticationError('Could not authenticate user.'));
      }
      if (recipient === null) {
        return cb(new errors.AuthenticationError('Could not authenticate user.'));
      }
      this.clientCore.getClientById(recipient.client_id, function(getClientErr, client){
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

/*
* middleware function that gets the headers and injects the context
*/
Authentication.prototype.authenticate = function(req, res, next){
  Authenticate.call(req.bold, req.headers, function(err, session) {
    if (err) {
      return res.status(err.code).json({
        message: err.message,
        type: err.type
      });
    }
    req.session = session;
    next();
  });
};

module.exports = {
  new: function(config) {
    return new Authentication(config);
  }
};
