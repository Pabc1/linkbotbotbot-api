'use strict';
module.exports = {
  mongoDs: {
    url: process.env.MONGO_URI,
    connector: 'mongodb',
    name: 'mongoDs',
  },
  emailDs: {
    transports: [{
      type: 'SMTP',
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    }],
  },
};
