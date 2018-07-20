'use strict';

module.exports = function(User) {
  User.beforeRemote('create', (ctx, user, next) => {
    if (ctx.req.headers.authorization) {
      const token = ctx.req.headers.authorization.split(' ');
      if (token[0].toLowerCase() === 'bearer' &&
          token[1] === process.env.BOT_TOKEN) {
        return next();
      }
    };
    console.log('wut');
    next({statusCode: 401});
  });
};
