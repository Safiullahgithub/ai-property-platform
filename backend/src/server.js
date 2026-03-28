require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const propertyRoutes = require('./routes/property');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({
  status: 'ok', service: 'PropAI API v2', provider: process.env.AI_PROVIDER || 'free',
  freeModel: 'Hugging Face (BLIP + Mistral-7B)', timestamp: new Date().toISOString()
}));

app.use('/api/property', propertyRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`\n🏠  PropAI API v2 running → http://localhost:${PORT}`);
  console.log(`🤖  AI Provider: ${process.env.AI_PROVIDER || 'free'}`);
  console.log(`🆓  Free model: Hugging Face (BLIP captioning + Mistral-7B)\n`);
});
