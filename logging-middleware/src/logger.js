/**
 * Core Winston-based logger.
 *
 * Provides a singleton logger instance with:
 *  - Console transport (colorized, pretty-printed)
 *  - File transport (JSON, written to app.log)
 *  - Custom log levels: error, warn, info, http, debug
 *  - ISO-format timestamps on every entry
 *
 * @module logger
 */

const winston = require('winston');
const path = require('path');

// ---------------------------------------------------------------------------
// Custom log levels & colours
// ---------------------------------------------------------------------------

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

winston.addColors(colors);

// ---------------------------------------------------------------------------
// Shared formats
// ---------------------------------------------------------------------------

/** ISO-8601 timestamp appended to every log entry. */
const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DDTHH:mm:ss.SSSZ', // ISO 8601
});

/** Enrich the info object with a readable label when needed. */
const labelFormat = winston.format.label({
  label: 'app',
});

// ---------------------------------------------------------------------------
// Transports
// ---------------------------------------------------------------------------

/**
 * Console transport – colourised and human-readable.
 * Uses `combine(colorize, printf)` so output looks like:
 *   2024-01-15T10:30:00.000+0000 [info] [app]: Server started on port 3000
 */
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, label, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} [${level}] [${label}]: ${message}${metaStr}`;
    }),
  ),
});

/**
 * File transport – structured JSON for machine consumption.
 * Writes to `app.log` in the current working directory.
 */
const fileTransport = new winston.transports.File({
  filename: path.resolve('app.log'),
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.json(),
  ),
  maxsize: 5 * 1024 * 1024, // 5 MB rotation
  maxFiles: 5,
});

// ---------------------------------------------------------------------------
// Logger instance
// ---------------------------------------------------------------------------

/**
 * Determine the current log level from the environment.
 * Defaults to 'debug' in development and 'info' in production.
 */
const currentLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? 'info' : 'debug';
};

const logger = winston.createLogger({
  level: currentLevel(),
  levels,
  format: winston.format.combine(
    labelFormat,
    timestampFormat,
    winston.format.errors({ stack: true }),
  ),
  transports: [consoleTransport, fileTransport],
  exitOnError: false,
});

module.exports = logger;
