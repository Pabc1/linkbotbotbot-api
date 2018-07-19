'use strict';
module.exports = (app) => {
  const Role = app.models.Role;
  const user = app.models.user;
  const RoleMapping = app.models.RoleMapping;
  Role.findOrCreate({
    name: 'registered',
  });

  Role.findOrCreate({
    name: 'bot',
  }, (err, role) => {
    user.findOrCreate({
      username: 'bot',
      password: process.env.API_PASSWORD,
      email: 'bot@gmail.com',
    }, (err, bot) => {
      role.principals.findOne({
        principalType: RoleMapping.USER,
        principalId: bot._id,
      }, (err, principal) => {
        if (!principal)
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: bot._id,
          });
      });
    });
  });
};
