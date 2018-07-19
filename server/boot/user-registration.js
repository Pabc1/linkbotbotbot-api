'use strict';
const slackUrl = 'https://slack.com/';
const {WebClient} = require('@slack/client');
const web = new WebClient(process.env.SLACK_TOKEN);
module.exports = (app) => {
  app.get('/oauth', (req, res) => {
    console.log(req.query);
    console.log('Got here');
  });

  const registerUsers = (cursor) => {
    const params = {};
    // I am trying
    if (cursor) params.cursor = cursor;
    web.users.list(params)
      .then(response => {
        if (!response.ok)
          return Promise.reject({
            statusCode: 500,
            message: 'Something went wrong',
          });
        response.members.map(member => {
          if (member.is_bot) return;
          const SlackUser = app.models.SlackUser;
          SlackUser.findOrCreate({
            where: {
              slackId: member.id,
              teamId: member.team_id,
            },
          }, {
            teamId: member.team_id,
            slackId: member.id,
            username: member.name,
            email: member.profile.email,
          }, (err, slackUser, created) => {
            if (err) return console.log(err);
          });
        });
        if (response.response_metadata &&
            response.response_metadata.next_cursor)
          registerUsers(response.response_metadata.next_cursor);
      });
  };

  registerUsers();
};
