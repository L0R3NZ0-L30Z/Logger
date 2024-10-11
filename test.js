const express = require('express');
const app = express();

// SSE route
app.get('/events', (req, res) => {
  // Add CORS headers to allow your React app to connect
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify your domain
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send a message every 3 seconds
  setInterval(() => {
    res.write(`data: Test message ${Date.now()}\n\n`);
  }, 3000);
});

// Start the server
app.listen(4000, () => {
  console.log('SSE server running on port 4000');
});
