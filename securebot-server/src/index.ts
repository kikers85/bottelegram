import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple JSON storage path
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const BOTS_FILE = path.join(DATA_DIR, 'bots.json');
const FLOWS_FILE = path.join(DATA_DIR, 'flows.json');

const readData = (file: string) => {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

const writeData = (file: string, data: any) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Bots management
app.get('/api/bots', (req, res) => {
  res.json(readData(BOTS_FILE));
});

app.post('/api/bots', (req, res) => {
  const bots = readData(BOTS_FILE);
  const newBot = { id: Date.now(), ...req.body, isActive: true };
  bots.push(newBot);
  writeData(BOTS_FILE, bots);
  res.json(newBot);
});

// Flows management
app.get('/api/flows', (req, res) => {
  res.json(readData(FLOWS_FILE));
});

app.post('/api/flows', (req, res) => {
  const flows = readData(FLOWS_FILE);
  const newFlow = { id: Date.now(), ...req.body };
  flows.push(newFlow);
  writeData(FLOWS_FILE, flows);
  res.json(newFlow);
});

app.listen(port, () => {
  console.log(`🚀 SecureBot Server (JSON Mode) running at http://localhost:${port}`);
});
