'use strict';
module.exports = {
  mongoDs: {
    url: process.env.MONGO_URI,
    connector: 'mongodb',
    name: 'mongoDs',
  },
};
