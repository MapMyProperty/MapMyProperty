const express = require('express');
const cors = require('cors');
const router = require('./routes/index.js');
const morgan = require('morgan');
const path = require('path')
const dotenv = require('dotenv');
dotenv.config();

const app = express();
// app.use(cors());
const corsOptions = {
  origin: [process.env.CLIENT_PORT_LOCAL, process.env.ADMIN_PORT_LOCAL],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Redirect /uploads to Cloudflare R2
app.get('/uploads/:filename', (req, res) => {
  const r2Domain = process.env.R2_PUBLIC_DOMAIN;
  if (!r2Domain) {
    return res.status(500).json({ error: 'R2_PUBLIC_DOMAIN not configured' });
  }
  // Ensure we don't end up with double slashes if env var has trailing slash
  const baseUrl = r2Domain.endsWith('/') ? r2Domain.slice(0, -1) : r2Domain;
  res.redirect(`${baseUrl}/${req.params.filename}`);
});

// app.use(express.static(path.join(__dirname, ('./public'))))
morgan.token("custom-date", (req, res) => {
  return new Date().toUTCString();
});
app.use(
  morgan(
    ":custom-date :method :url :status :res[content-length] - :response-time ms"
  )
);
console.log(morgan);
app.use('/api', router);

module.exports = app;
