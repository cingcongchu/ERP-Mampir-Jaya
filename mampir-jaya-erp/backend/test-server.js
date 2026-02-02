const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'API is working', timestamp: new Date() });
});

const PORT = 5002;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Simple test server running on http://${HOST}:${PORT}`);
});