const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const events = require('./routes/api/events.js');
app.use('/api/events', events);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on ${port}`));