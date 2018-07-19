'use strict';
module.exports = (Model, options) => {
  Model.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance)
      ctx.instance.createdAt = new Date();
    ctx.instance.updatedAt = new Date();
    next();
  });
};
