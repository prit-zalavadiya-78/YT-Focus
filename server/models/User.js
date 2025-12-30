import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  
  // ✅ ADDED: Bio field for profile
  bio: { type: String, default: "" },

  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  
  streak: { type: Number, default: 0 },
  lastStudyDate: { type: Date },

  // Github-style contribution graph data
  activityLog: [{
    date: { type: String }, 
    count: { type: Number, default: 0 } 
  }],

  stats: {
    totalMinutes: { type: Number, default: 0 },
    videosCompleted: { type: Number, default: 0 },
    quizzesPassed: { type: Number, default: 0 }
  },

  // ✅ ADDED: Certificates array
  certificates: [{
    courseId: String,
    courseTitle: String,
    thumbnail: String,
    issuedAt: { type: Date, default: Date.now },
    imageUrl: String // Stores the Base64 image data
  }]
}, {
  timestamps: true
});
export default mongoose.model('User', userSchema);