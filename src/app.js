const express = require('express');
const bodyParser = require('body-parser');
const predictRoute = require('./routes/API');
const { loadModel } = require('./models/modelLoader');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/', predictRoute);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await loadModel();
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
