/**
 * logging-middleware
 *
 * A reusable logging package for Express backends and Axios-based frontends.
 * Provides a pre-configured Winston logger, Express HTTP request logging
 * middleware, and an Axios interceptor factory.
 *
 * @module logging-middleware
 */

const logger = require('./src/logger');
const { httpLogger } = require('./src/httpLogger');
const { axiosLogger } = require('./src/axiosLogger');

module.exports = {
  logger,
  httpLogger,
  axiosLogger,
};
