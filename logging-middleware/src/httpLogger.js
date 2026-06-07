/**
 * Express HTTP request / response logging middleware.
 *
 * Captures:
 *  - HTTP method, original URL, status code, response time (ms)
 *  - Request body (sanitised – passwords and secrets are redacted)
 *  - A short summary of the response body (first 200 chars)
 *
 * @module httpLogger
 */

const logger = require('./logger');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fields whose values will be replaced with '[REDACTED]'. */
const SENSITIVE_KEYS = new Set([
  'password',
  'passwd',
  'secret',
  'token',
  'authorization',
  'auth',
  'creditcard',
  'credit_card',
  'cc',
  'ssn',
  'apikey',
  'api_key',
  'access_token',
  'refresh_token',
]);

/**
 * Deep-clone a plain object / array, replacing any sensitive values.
 *
 * @param {*} obj  The value to sanitise (usually `req.body`).
 * @returns {*}    A sanitised copy, or the original primitive.
 */
function sanitize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item));
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase().replace(/[-_\s]/g, ''))) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitize(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Produce a short summary string from a response body.
 *
 * @param {*} body  The captured response body.
 * @param {number} [maxLen=200]  Maximum length of the returned string.
 * @returns {string}
 */
function summariseBody(body, maxLen = 200) {
  if (body === undefined || body === null) return '';
  let text;
  if (typeof body === 'string') {
    text = body;
  } else {
    try {
      text = JSON.stringify(body);
    } catch {
      text = String(body);
    }
  }
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/**
 * Express middleware that logs every HTTP request and its response.
 *
 * Usage:
 * ```js
 * const { httpLogger } = require('logging-middleware');
 * app.use(httpLogger);
 * ```
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function httpLogger(req, res, next) {
  const start = process.hrtime.bigint();

  // ---- Capture the response body by monkey-patching res.write / res.end ---
  const chunks = [];
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  res.write = function wrappedWrite(chunk, ...args) {
    try {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
    } catch {
      // Swallow – logging must never break the response.
    }
    return originalWrite(chunk, ...args);
  };

  res.end = function wrappedEnd(chunk, ...args) {
    try {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
    } catch {
      // Swallow
    }

    // Restore originals immediately so nothing else double-wraps.
    res.write = originalWrite;
    res.end = originalEnd;

    // ---- Compute timing --------------------------------------------------
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6; // ms

    // ---- Build the log entry ---------------------------------------------
    const entry = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime: `${elapsed.toFixed(2)}ms`,
    };

    // Sanitised request body (only when present & non-empty)
    if (req.body && Object.keys(req.body).length > 0) {
      entry.requestBody = sanitize(req.body);
    }

    // Response body summary
    try {
      const raw = Buffer.concat(chunks).toString('utf8');
      const summary = summariseBody(raw);
      if (summary) {
        entry.responseBody = summary;
      }
    } catch {
      // Ignore – binary or non-UTF8 bodies are fine to skip.
    }

    // Pick the log level based on status code
    const status = res.statusCode;
    if (status >= 500) {
      logger.error('HTTP Request', entry);
    } else if (status >= 400) {
      logger.warn('HTTP Request', entry);
    } else {
      logger.http('HTTP Request', entry);
    }

    return originalEnd.call(res, chunk, ...args);
  };

  next();
}

module.exports = { httpLogger };
