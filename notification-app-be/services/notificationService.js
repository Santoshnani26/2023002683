const axios = require('axios');
const config = require('../config');
const { axiosLogger, logger } = require('logging-middleware');
const { sortByPriority, paginate } = require('../utils/prioritySort');

class NotificationService {
  constructor() {
    this.api = axios.create({
      baseURL: config.affordmedBaseUrl,
      timeout: 5000,
    });
    
    // Attach custom logging middleware to this axios instance
    axiosLogger(this.api);
    
    // Ensure auth token is attached to requests
    this.api.interceptors.request.use((req) => {
      if (config.affordmedAuthToken) {
        req.headers.Authorization = `Bearer ${config.affordmedAuthToken}`;
      }
      return req;
    });
  }

  // Fetch from the test server by type
  async fetchNotifications(type) {
    try {
      // Typically, Affordmed endpoints might be like /test/notifications?type=placement
      const response = await this.api.get('/notifications', {
        params: { type }
      });
      
      // If the API returns an array, map over it. If it returns { data: [] }, handle appropriately.
      let data = response.data;
      if (!Array.isArray(data) && data.data) {
          data = data.data;
      }
      
      // Ensure all objects have the type attached if it's missing
      return Array.isArray(data) ? data.map(item => ({ ...item, type })) : [];
    } catch (error) {
      logger.error(`Error fetching notifications of type ${type}`, { error: error.message });
      // In a real scenario, we might want to refresh the token if we get 401. 
      // For the assessment, returning empty array or throwing is standard.
      return []; 
    }
  }

  // Fetch all categories in parallel
  async fetchAllNotifications() {
    try {
      const types = ['placement', 'result', 'event'];
      const promises = types.map(type => this.fetchNotifications(type));
      
      const results = await Promise.allSettled(promises);
      
      let allNotifications = [];
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allNotifications = allNotifications.concat(result.value);
        }
      });
      
      return allNotifications;
    } catch (error) {
      logger.error('Error fetching all notifications', { error: error.message });
      throw new Error('Failed to fetch notifications from provider');
    }
  }

  async getPriorityNotifications(page = 1, limit = 10) {
    const allNotifications = await this.fetchAllNotifications();
    const sorted = sortByPriority(allNotifications);
    return paginate(sorted, page, limit);
  }

  async getNotificationCounts() {
    const allNotifications = await this.fetchAllNotifications();
    const counts = {
      placement: 0,
      result: 0,
      event: 0,
      total: allNotifications.length
    };
    
    allNotifications.forEach(n => {
      const type = n.type?.toLowerCase();
      if (counts[type] !== undefined) counts[type]++;
    });
    
    return counts;
  }
}

module.exports = new NotificationService();
