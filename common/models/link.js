'use strict';
const app = require('../../server/server');

module.exports = function(Link) {
  Link.beforeRemote('find', (ctx, links, next) => {
    console.log('hello');
    const user = app.models.user;
    user.findById(ctx.req.accessToken.userId, (err, result) => {
      console.log(result);
      ctx.args.filter = {
        where: {
          team: result.teamId,
          user: result.slackId,
        },
      };
      next();
    });
  });

  Link.afterRemote('find', (ctx, links, next) => {
    next();
  });
};
