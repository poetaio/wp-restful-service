const express = require('express');
const cors = require('cors');

require('dotenv').config();

const router = require('./routes/index');

const PORT = process.env.PORT || 5000;
const app = express();
const errorHandler = require('./middleware/errorHandlingMiddleware');

app.use(express.json());
app.use(cors());

app.use('/api', router);

app.use(errorHandler);

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
