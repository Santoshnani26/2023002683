require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  affordmedBaseUrl: process.env.AFFORDMED_BASE_URL || 'http://20.244.56.144/test',
  affordmedAuthToken: process.env.AFFORDMED_AUTH_TOKEN,
  companyName: process.env.COMPANY_NAME,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
};
