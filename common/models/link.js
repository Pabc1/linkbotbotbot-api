'use strict';
const app = require('../../server/server');

module.exports = function(Link) {
  Link.addTag = (id, tag, next) => {
    Link.findById(id, (err, link) => {
      if (err) next(err);
      const tags = link.tags ? link.tags : [];
      if (tags && tags.includes(tag.toLowerCase()))
        return next({statusCode: 409, message: 'This tag already exists'});
      link.tags = tags.concat(tag);
      link.save((err, link) => {
        if (err) return next(err);
        next(null, link);
      });
    });
  };

  Link.deleteTag = (id, tag, next) => {
    Link.findById(id, (err, link) => {
      if (err) next(err);
      const tags = link.tags ? link.tags : [];
      if (!tags || !tags.includes(tag.toLowerCase()))
        return next({statusCode: 404, message: 'Link does not have this tag'});
      const index = tags.indexOf('tag');
      link.tags.splice(index, 1);
      link.save((err, link) => {
        next(null, link);
      });
    });
  };

  Link.beforeRemote('find', (ctx, links, next) => {
    const user = app.models.user;
    user.findById(ctx.req.accessToken.userId, (err, result) => {
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

  Link.remoteMethod(
    'addTag',
    {
      description: 'Add tag to a link',
      http: {
        path: '/:id/tags',
        verb: 'post',
      },
      accepts: [
        {arg: 'id', type: 'string', required: true},
        {arg: 'tag', type: 'string'},
      ],
      returns: {root: true, type: 'object'},
    }
  );

  Link.remoteMethod(
    'deleteTag',
    {
      description: 'Remove a tag from a link',
      http: {
        path: '/:id/tags',
        verb: 'delete',
      },
      accepts: [
        {arg: 'id', type: 'string', required: true},
        {arg: 'tag', type: 'string'},
      ],
      returns: {root: true, type: 'object'},
    }
  );
};
