// Keep Replit alive by pinging itself
const http = require('http');

function keepAlive() {
  setInterval(() => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 5000,
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`Keep-alive ping: ${res.statusCode}`);
    });

    req.on('error', (err) => {
      console.log(`Keep-alive error: ${err.message}`);
    });

    req.end();
  }, 5 * 60 * 1000); // Every 5 minutes
}

module.exports = { keepAlive };