const { logger } = require('./logger');

const axiosLogger = (axiosInstance) => {
  axiosInstance.interceptors.request.use((request) => {
    // Log the request, but sanitize headers
    const sanitizedHeaders = { ...request.headers };
    if (sanitizedHeaders.Authorization) {
      sanitizedHeaders.Authorization = 'Bearer ***';
    }

    logger.http('Outgoing Axios Request', {
      method: request.method,
      url: request.url,
      baseURL: request.baseURL,
      headers: sanitizedHeaders,
      params: request.params
    });
    
    // Add start time to calculate duration later
    request.metadata = { startTime: new Date() };
    return request;
  }, (error) => {
    logger.error('Axios Request Error', { error: error.message, stack: error.stack });
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use((response) => {
    const duration = response.config.metadata ? new Date() - response.config.metadata.startTime : 'unknown';
    logger.http('Incoming Axios Response', {
      method: response.config.method,
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`
    });
    return response;
  }, (error) => {
    const duration = error.config && error.config.metadata ? new Date() - error.config.metadata.startTime : 'unknown';
    logger.error('Axios Response Error', {
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      duration: `${duration}ms`,
      data: error.response?.data
    });
    return Promise.reject(error);
  });

  return axiosInstance;
};

module.exports = { axiosLogger };
