'use strict';

module.exports = (app) => {
  app.get('/verified', (req, res) => {
    res.send('Your email has been verified');
  });
};
