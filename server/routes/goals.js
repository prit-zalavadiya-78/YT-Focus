import express from 'express';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { generateCertificate } from '../utils/certificateGenerator.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// @route   GET /api/goals
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/goals/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/goals
router.post('/', protect, async (req, res) => {
  const { title, playlistUrl, videos, thumbnail, instructor } = req.body;
  try {
    if (!title || !videos || videos.length === 0) return res.status(400).json({ message: 'Invalid goal data' });

    const formattedVideos = videos.map((v, index) => ({
      ...v,
      isCurrent: index === 0,
      watched: false
    }));

    const goal = await Goal.create({
      user: req.user._id,
      title,
      playlistUrl,
      thumbnail,
      instructor,
      totalVideos: videos.length,
      completedVideos: 0,
      progress: 0,
      videos: formattedVideos
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/goals/:id/progress
// @desc    Mark video as watched, update User Stats/Streak, and check for Certificate
router.patch('/:id/progress', protect, async (req, res) => {
  const { videoId } = req.body;

  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const videoIndex = goal.videos.findIndex(v => v._id.toString() === videoId);
    if (videoIndex === -1) return res.status(404).json({ message: 'Video not found' });

    // ONLY UPDATE IF NOT ALREADY WATCHED
    if (!goal.videos[videoIndex].watched) {
        goal.videos[videoIndex].watched = true;
        goal.videos[videoIndex].isCurrent = false;
        goal.completedVideos += 1;
        
        // Unlock next video
        if (videoIndex + 1 < goal.videos.length) {
          goal.videos[videoIndex + 1].isCurrent = true;
        }

        // Recalculate Goal Progress
        goal.progress = Math.round((goal.completedVideos / goal.totalVideos) * 100);
        await goal.save();

        // ---------------------------------------------------------
        // ✅ 1. UPDATE USER STATS, STREAK & ACTIVITY LOG
        // ---------------------------------------------------------
        const user = await User.findById(req.user._id);
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // A. Update Stats
        user.stats.videosCompleted += 1;
        user.stats.quizzesPassed += 1; // Increment quiz count (user passed quiz to complete video)
        
        // Add time spent (use video duration if available, fallback to 10 minutes)
        // Parse as integer to prevent string concatenation (e.g., "10" + "8" = "108")
        const videoDuration = parseInt(goal.videos[videoIndex].duration) || 10;
        user.stats.totalMinutes += videoDuration;
        
        user.xp += 50; // Award XP per video
        
        // Level Up Logic - Every 100 XP = 1 Level
        const newLevel = Math.floor(user.xp / 100) + 1;
        if (newLevel > user.level) {
          user.level = newLevel;
        }

        // B. Update Activity Log (Heatmap/Graph)
        const logIndex = user.activityLog.findIndex(l => l.date === todayStr);
        if (logIndex >= 0) {
            user.activityLog[logIndex].count += 1;
        } else {
            user.activityLog.push({ date: todayStr, count: 1 });
        }

        // C. Update Streak
        const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate).toISOString().split('T')[0] : null;
        
        if (lastStudy !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastStudy === yesterdayStr) {
                user.streak += 1; // Continued streak
            } else {
                user.streak = 1; // Broken streak or first day
            }
            user.lastStudyDate = new Date();
        }
        
        // ---------------------------------------------------------
        // ✅ 2. CERTIFICATE CHECK
        // ---------------------------------------------------------
        if (goal.progress === 100) {
            const alreadyHasCert = user.certificates.some(c => c.courseId === goal._id.toString());
            
            if (!alreadyHasCert) {
                try {
                  const certImage = await generateCertificate(user.name, goal.title, new Date());
                  user.certificates.push({
                      courseId: goal._id,
                      courseTitle: goal.title,
                      thumbnail: goal.thumbnail,
                      imageUrl: certImage
                  });
                  user.xp += 500; // Bonus XP for completion
                } catch (certError) {
                  console.error("Certificate Generation Failed:", certError);
                }
            }
        }

        await user.save();
    }

    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/goals/:id/notes
// @desc    Save notes for a specific video
router.patch('/:id/notes', protect, async (req, res) => {
  const { videoId, notes } = req.body;

  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const videoIndex = goal.videos.findIndex(v => v._id.toString() === videoId);
    if (videoIndex === -1) return res.status(404).json({ message: 'Video not found' });

    goal.videos[videoIndex].notes = notes;
    await goal.save();

    res.json({ success: true, notes: goal.videos[videoIndex].notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/goals/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    await goal.deleteOne();
    res.json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;