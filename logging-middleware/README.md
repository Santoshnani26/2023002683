# Logging Middleware

A reusable logging middleware for Affordmed Full Stack Assessment.

## Installation

```bash
npm install winston
```

## Usage in Express (Backend)

```javascript
const express = require('express');
const { httpLogger, logger } = require('logging-middleware');

const app = express();

app.use(httpLogger);

app.get('/', (req, res) => {
  logger.info('Handling root request');
  res.send('Hello');
});
```

## Usage with Axios (Frontend or Backend)

```javascript
const axios = require('axios');
const { axiosLogger } = require('logging-middleware');

const instance = axios.create({
  baseURL: 'http://api.example.com'
});

// Attach logging interceptors
axiosLogger(instance);
```
