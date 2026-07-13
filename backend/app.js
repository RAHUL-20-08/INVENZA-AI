import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes mounting
app.use('/api', apiRouter);

// Base route for server diagnostics
app.get('/', (req, res) => {
  res.json({
    message: 'Lost Innovation AI System API is online.',
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
});

app.listen(PORT, () => {
  console.log(`Lost Innovation server running on port ${PORT}`);
});
