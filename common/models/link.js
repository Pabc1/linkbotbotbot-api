'use strict';

module.exports = function(Link) {
  Link.afterRemote('find', (ctx, links, next) => {
    next();
  });
};
