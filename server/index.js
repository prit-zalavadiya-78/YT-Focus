import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.js';
import goalRoutes from './routes/goals.js';
import userRoutes from './routes/userRoutes.js';
import youtubeRoutes from './routes/youtube.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Increase JSON payload limit for large playlist data
app.use(express.json({ limit: '10mb' }));

// ✅ CORS Configuration - Only allow specific origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://ytfocus.vercel.app",
  "https://yt-focus-eosin.vercel.app",
  "https://yt-focus-psi.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin matches our allowed list (no wildcards for security)
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ App connected to database');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });
