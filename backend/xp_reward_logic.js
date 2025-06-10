const express = require('express');
const cors = require('cors');
const { registerUser, rewardXP, getUserXP } = require('./xp_reward_logic');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// POST: Reward XP for a task
app.post('/api/reward', (req, res) => {
  const { userId, taskId, amount } = req.body;

  if (!userId || !taskId || typeof amount !== 'number') {
    return res.status(400).json({ status: 'error', message: 'Invalid input' });
  }

  const result = rewardXP(userId, taskId, amount);
  res.json(result);
});

// GET: Get current XP
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ status: 'error', message: 'No userId provided' });

  const data = getUserXP(userId);
  res.json({ status: 'success', ...data });
});

app.listen(PORT, () => {
  console.log(`GrindPay XP backend running on port ${PORT}`);
});
