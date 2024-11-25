import express from 'express';
import { initializeDatabase } from './config/database.js';
import { resourceRoutes } from './routes/resourceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

initializeDatabase();

app.use(errorHandler);

resourceRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});