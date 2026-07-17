import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import testRoutes from './routes/tests';
import runRoutes from './routes/runs';
import recordRoutes from './routes/record';
import deviceRoutes from './routes/devices';
import dashboardRoutes from './routes/dashboard';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static runs directory
app.use('/runs', express.static(path.join(__dirname, '../runs')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api', runRoutes);
app.use('/api/record', recordRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaaS backend running' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

export default app;
