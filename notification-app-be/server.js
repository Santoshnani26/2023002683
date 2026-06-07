const express = require('express');
const cors = require('cors');
const { httpLogger, logger } = require('logging-middleware');
const config = require('./config');
const notificationRoutes = require('./routes/notifications');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(httpLogger);

// Routes
app.use('/api', notificationRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
