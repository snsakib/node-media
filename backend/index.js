const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.body); // Logs the parsed JSON body
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});