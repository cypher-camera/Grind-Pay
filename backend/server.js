// Express server with email + password + OTP auth
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Simulated user DB
const users = {}; // { email: { password, otp, verified, xp, history } }

// Helper to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register user
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password required' });
  
  if (users[email]) return res.status(400).json({ status: 'error', message: 'Email already registered' });

  const otp = generateOTP();
  users[email] = { password, otp, verified: false, xp: 0, history: [] };

  console.log(`OTP for ${email}: ${otp}`); // In production, send this via email
  res.json({ status: 'otp_sent', message: 'OTP sent to email (check console in dev)' });
});

// Verify OTP
app.post('/api/verify', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp || !users[email]) return res.status(400).json({ status: 'error', message: 'Invalid request' });

  if (users[email].otp === otp) {
    users[email].verified = true;
    return res.json({ status: 'success', message: 'Email verified' });
  }

  res.status(401).json({ status: 'error', message: 'Invalid OTP' });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }

  if (!users[email].verified) {
    return res.status(403).json({ status: 'error', message: 'Email not verified' });
  }

  const userId = crypto.createHash('sha256').update(email).digest('hex');
  res.json({ status: 'success', userId });
});

// Reward XP
app.post('/api/reward', (req, res) => {
  const { userId, taskId, amount } = req.body;
  const email = Object.keys(users).find(e => crypto.createHash('sha256').update(e).digest('hex') === userId);

  if (!email || !users[email]) return res.status(400).json({ status: 'error', message: 'User not found' });

  if (users[email].history.some(h => h.taskId === taskId)) {
    return res.status(409).json({ status: 'error', message: 'Task already completed' });
  }

  users[email].xp += amount;
  users[email].history.push({ taskId, amount, time: Date.now() });
  res.json({ status: 'success', xp: users[email].xp });
});

// Get XP
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const email = Object.keys(users).find(e => crypto.createHash('sha256').update(e).digest('hex') === userId);
  if (!email || !users[email]) return res.status(404).json({ status: 'error', message: 'User not found' });

  res.json({ status: 'success', xp: users[email].xp, tasksCompleted: users[email].history.length });
});

app.listen(PORT, () => {
  console.log(`Auth + XP server running on port ${PORT}`);
});
