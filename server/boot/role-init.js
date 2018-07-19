'use strict';
module.exports = (app) => {
  const Role = app.models.Role;
  Role.findOrCreate({
    name: 'registered',
  });
};
