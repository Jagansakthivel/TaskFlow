import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import taskRoutes from './server/routes/taskRoutes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS headers for API flexibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Optional MongoDB connection via Mongoose when MONGODB_URI is configured
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && mongoUri.trim() !== '') {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('Connected to MongoDB via Mongoose ODM');
    } catch (err) {
      console.warn(
        'MongoDB connection unavailable, using synchronized local persistence store:',
        err instanceof Error ? err.message : String(err)
      );
    }
  }

  // REST API Routes
  app.use('/api/v1/tasks', taskRoutes);

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'TaskFlow API',
      database:
        mongoose.connection.readyState === 1 ? 'mongodb' : 'local-persistent-store',
    });
  });

  // Vite middleware for development / static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error('Unhandled server error:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
      });
    }
  );

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskFlow full-stack server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
