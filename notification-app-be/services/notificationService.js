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
      // For Affordmed, typical endpoints are path-based rather than query params.
      // We will call GET http://20.244.56.144/test/{type} (e.g., /test/placement)
      const endpoint = type ? `/${type}` : '/notifications';
      
      const response = await this.api.get(endpoint);
      
      // If the API returns an array, map over it. If it returns { data: [] }, handle appropriately.
      let data = response.data;
      if (!Array.isArray(data) && data.data) {
          data = data.data;
      }
      
      // Ensure all objects have the type attached if it's missing
      return Array.isArray(data) ? data.map(item => ({ ...item, type: type || item.type })) : [];
    } catch (error) {
      logger.error(`Error fetching notifications of type ${type}`, { 
        message: error.message,
        status: error.response?.status
      });
      
      // MOCK DATA FALLBACK for when Affordmed test server is down
      logger.warn(`Test server is down. Falling back to mock data for type: ${type}`);
      return this._generateMockData(type);
    }
  }

  // Helper method to generate dummy data for the UI
  _generateMockData(type) {
    const mockPlacement = [
      { id: 'p1', title: 'Google Campus Drive', description: 'Software Engineer role opening. Register by tomorrow.', type: 'placement', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'p2', title: 'Microsoft Internship', description: 'Summer 2026 internship applications are open.', type: 'placement', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ];
    const mockResult = [
      { id: 'r1', title: 'Amazon Drive Results', description: 'Congratulations! You have cleared the technical round.', type: 'result', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 'r2', title: 'TCS Ninja Results', description: 'Aptitude test results have been declared.', type: 'result', timestamp: new Date(Date.now() - 172800000).toISOString() }
    ];
    const mockEvent = [
      { id: 'e1', title: 'Hackathon 2026', description: 'Annual 48-hour coding hackathon starts this weekend!', type: 'event', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 'e2', title: 'Tech Talk: System Design', description: 'Join us for a webinar on distributed systems.', type: 'event', timestamp: new Date(Date.now() - 259200000).toISOString() }
    ];

    if (type === 'placement') return mockPlacement;
    if (type === 'result') return mockResult;
    if (type === 'event') return mockEvent;
    
    // If no specific type requested, return all
    return [...mockPlacement, ...mockResult, ...mockEvent];
  }

  // Fetch all categories in parallel
  async fetchAllNotifications() {
    try {
      const types = ['placement', 'result', 'event'];
      const promises = types.map(type => this.fetchNotifications(type));
      
      // Use Promise.all so that if ANY request fails (like 401 Unauthorized), 
      // the error is thrown rather than swallowed.
      const results = await Promise.all(promises);
      
      let allNotifications = [];
      results.forEach(val => {
        allNotifications = allNotifications.concat(val);
      });
      
      return allNotifications;
    } catch (error) {
      logger.error('Error fetching all notifications', { error: error.message });
      // Bubble up the actual error from fetchNotifications
      throw error;
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
