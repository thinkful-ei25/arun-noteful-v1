'use strict';

// eslint-disable-next-line no-unused-vars
function logger(req, res, next) {
  const now = new Date();
  // eslint-disable-next-line no-console
  console.log(`${now.toISOString()} ${req.method} ${req.path}`);
  next();
}

module.exports = { logger };
