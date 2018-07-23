'use strict';
const loopback = require('loopback');

module.exports = function(User) {
  User.resPassword = (id, next) => {
    User.findById(id, (err, user) => {
      const newPassword = Math.random().toString(36).substring(5);
      user.setPassword(newPassword, (error) => {
        User.app.models.Email.send({
          to: user.email,
          from: 'linkbotbotbot@gmail.com',
          subject: 'Password reset',
          text: `Your password has been reset. You can access with the following password: ${newPassword}`,
        }, err => {
          if (err) return next(err);
          next(null, {statusCode: 200, message: 'An email has been sent'});
        });
      });
    });
  };

  User.on('resetPasswordRequest', info => {
    const resetAddress = process.env.LINKBOTBOTBOT_RESET +
          `access_token=${info.accessToken.id}`;
    User.app.models.Email.send({
      to: info.email,
      from: 'linkbotbotbot@gmail.com',
      subject: 'Password reset',
      text: `Access the following link to reset your password: ${resetAddress}`,
    });
  });

  User.beforeRemote('create', (ctx, user, next) => {
    if (ctx.req.headers.authorization) {
      const token = ctx.req.headers.authorization.split(' ');
      if (token[0].toLowerCase() === 'bearer' &&
          token[1] === process.env.BOT_TOKEN) {
        return next();
      }
    };
    next({statusCode: 401, message: 'You have to be authenticated'});
  });

  User.afterRemote('create', (ctx, user, next) => {
    const verifyAddress = process.env.LINKBOTBOTBOT_VERIFY +
          `uid=${user.id}&redirect=%2Fverified`;
    const options = {
      type: 'email',
      to: user.email,
      from: 'linkbotbotbot@gmail.com',
      subject: 'linkbotbotbot: verify your email address',
      protocol: 'https',
      verifyHref: verifyAddress,
      redirect: '/verified',
    };
    user.verify(options, (err, resp) => {
      if (err) return next(err);
      next();
    });
  });

  User.observe('after save', (ctx, next) => {
    const Link = loopback.getModel('Link');
    Link.updateAll({
      user: ctx.instance.slackId,
    }, {
      userId: ctx.instance.id,
    }, (err, info) => {
      if (err) return next(console.log(err));
      console.log(info.count);
      next();
    });
  });

  User.remoteMethod(
    'resPassword',
    {
      description: 'Reset a password',
      http: {
        path: '/:id/password-reset',
        verb: 'post',
      },
      accepts: {arg: 'id', type: 'string', required: true},
    }
  );
};
