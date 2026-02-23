import express from 'express';
import bodyParser from 'body-parser';
import { verifyPassword, updateWardData, getWard, initDB } from '../db';

const app = express();

app.use(bodyParser.json());

// Initialize DB wrapper
const withDB = (handler: (req: express.Request, res: express.Response) => Promise<any>) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      await initDB();
      await handler(req, res);
    } catch (error) {
      console.error('Request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Login endpoint
app.post('/api/login', withDB(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const ward = await verifyPassword(password) as any;
  if (ward) {
    res.json({ 
      success: true, 
      wardId: ward.id, 
      wardName: ward.name,
      data: ward.data ? JSON.parse(ward.data) : null 
    });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
}));

// Get Ward Data endpoint
app.get('/api/ward/:id', withDB(async (req, res) => {
  const { id } = req.params;
  const ward = await getWard(id as string) as any;
  
  if (ward) {
    res.json({ 
      id: ward.id, 
      name: ward.name, 
      data: ward.data ? JSON.parse(ward.data) : null 
    });
  } else {
    res.status(404).json({ error: 'Ward not found' });
  }
}));

// Update Ward Data endpoint
app.post('/api/ward/:id', withDB(async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }

  await updateWardData(id as string, JSON.stringify(data));
  res.json({ success: true });
}));

export default app;
