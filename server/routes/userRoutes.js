import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


// ... (Keep existing GET routes like /leaderboard) ...
// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/users/add-xp
router.patch('/add-xp', protect, async (req, res) => {
  // ✅ ADDED: type and timeSpent params
  const { amount, type, timeSpent } = req.body; 

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.xp += amount;
    
    // Level Up Logic
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > user.level) user.level = newLevel;

    // ✅ NEW: Update Specific Stats
    if (type === 'quiz') {
        user.stats.quizzesPassed += 1;
    }
    
    if (timeSpent && timeSpent > 0) {
        user.stats.totalMinutes += timeSpent;
        user.stats.videosCompleted += 1;
    }

    // Streak Logic (Same as before)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let lastDateStr = user.lastStudyDate ? new Date(user.lastStudyDate).toISOString().split('T')[0] : null;

    if (lastDateStr !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDateStr === yesterdayStr) user.streak += 1;
        else user.streak = 1;
        
        user.lastStudyDate = today;
    }

    // Activity Log
    const logIndex = user.activityLog.findIndex(log => log.date === todayStr);
    if (logIndex !== -1) user.activityLog[logIndex].count += 1;
    else user.activityLog.push({ date: todayStr, count: 1 });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (Avatar, Bio, Name)
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Use !== undefined to allow clearing fields with empty string
      if (req.body.name !== undefined) user.name = req.body.name;
      if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
      if (req.body.bio !== undefined) user.bio = req.body.bio;

      const updatedUser = await user.save();

      // Return the updated user data without the password
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        xp: updatedUser.xp,
        level: updatedUser.level,
        streak: updatedUser.streak,
        stats: updatedUser.stats,
        token: req.headers.authorization.split(' ')[1] // Maintain session
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;