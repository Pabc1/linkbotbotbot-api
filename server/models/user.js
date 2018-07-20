'use strict';
const loopback = require('loopback');

module.exports = function(User) {
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
      host: 'roasted-dodo.glitch.me',
      port: 0,
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
};
