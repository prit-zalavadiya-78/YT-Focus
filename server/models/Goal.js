import mongoose from 'mongoose';

const goalSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: { type: String, required: true },
  playlistUrl: { type: String, required: true },
  thumbnail: { type: String },
  instructor: { type: String },
  totalVideos: { type: Number, default: 0 },
  completedVideos: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  
  videos: [{
    youtubeId: { type: String },
    title: { type: String },
    duration: { type: String },
    watched: { type: Boolean, default: false },
    isCurrent: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    
    // Existing Quiz Field
    quiz: [{
      question: String,
      options: [String],
      correctAnswer: String
    }],

    // --- ADD THIS NEW FIELD ---
    flashcards: [{
      front: String,
      back: String
    }]
    // --------------------------
  }]
}, {
  timestamps: true
});

export default mongoose.model('Goal', goalSchema);