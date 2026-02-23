import express from 'express';
import { createServer as createViteServer } from 'vite';
import bodyParser from 'body-parser';
import { verifyPassword, updateWardData, getWard, initDB } from './db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  try {
    await initDB();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }

  app.use(bodyParser.json());

  // API Routes
  
  // Login endpoint
  app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    try {
      const ward = await verifyPassword(password) as any;
      if (ward) {
        // Return ward info without password
        res.json({ 
          success: true, 
          wardId: ward.id, 
          wardName: ward.name,
          data: ward.data ? JSON.parse(ward.data) : null 
        });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get Ward Data endpoint
  app.get('/api/ward/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const ward = await getWard(id) as any;
      
      if (ward) {
        res.json({ 
          id: ward.id, 
          name: ward.name, 
          data: ward.data ? JSON.parse(ward.data) : null 
        });
      } else {
        res.status(404).json({ error: 'Ward not found' });
      }
    } catch (error) {
      console.error('Get ward error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update Ward Data endpoint
  app.post('/api/ward/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    try {
      await updateWardData(id, JSON.stringify(data));
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating ward data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // Handle SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
