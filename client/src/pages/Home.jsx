import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Link2, MonitorPlay, ClipboardCheck, Lock, FileText, Brain, TrendingUp, Target, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white font-sans text-slate-900">
      
      {/* --- Sticky Navbar --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Play className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">YT Focus</span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium text-sm hidden sm:block transition-colors">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign Up Free
            </Link>
          </div>

        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
          Turn YouTube Playlists into<br />
          <span className="text-slate-800">Focused Learning Journeys</span>
        </h1>

        <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
          Watch videos step-by-step, unlock progress, summaries, and quizzes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/signup" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Get Started Free
          </Link>
          <a 
            href="#how-it-works" 
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            How it Works
          </a>
        </div>
      </main>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-xl font-semibold text-slate-800 mb-12">How it Works</h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <Link2 className="w-7 h-7 text-slate-700" />
              </div>
              <p className="text-sm font-medium text-slate-600">1. Paste YouTube Playlist</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <MonitorPlay className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-slate-600">2. Watch & Learn Step-by-Step</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <ClipboardCheck className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-slate-600">3. Test Knowledge & Track Progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Grid Section --- */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Everything You Need to Learn</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Powerful features designed to keep you focused and track your progress effectively.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Video Locking */}
            <FeatureCard 
              icon={<Lock className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-50"
              title="Video Locking"
              description="Stay focused by unlocking videos one at a time. No skipping ahead until you complete the current lesson."
            />
            
            {/* Feature 2 - AI Flashcards */}
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-50"
              title="AI Flashcards"
              description="Generate smart flashcards automatically from video content to reinforce your learning and memory."
            />
            
            {/* Feature 3 - AI Quizzes */}
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-green-600" />}
              iconBg="bg-green-50"
              title="AI-Generated Quizzes"
              description="Test your knowledge with automatically generated quizzes after each video. Pass to unlock the next lesson."
            />
            
            {/* Feature 4 - Progress Tracking */}
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
              iconBg="bg-orange-50"
              title="Progress Tracking"
              description="Track your daily streaks, XP earned, and completion rates. Visualize your learning journey with detailed stats."
            />
            
            {/* Feature 5 - Learning Goals */}
            <FeatureCard 
              icon={<Target className="w-6 h-6 text-teal-600" />}
              iconBg="bg-teal-50"
              title="Learning Goals"
              description="Set and achieve goals by importing YouTube playlists as structured courses with clear milestones."
            />

            {/* Feature 6 - Certificates */}
            <FeatureCard 
              icon={<Award className="w-6 h-6 text-amber-600" />}
              iconBg="bg-amber-50"
              title="Certificates"
              description="Earn certificates when you complete a course. Download and share your achievements with others."
            />
          </div>
        </div>
      </section>

      {/* --- Simple Footer --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-bold text-slate-700">YT Focus</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-800 transition-colors">About</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-slate-400">© 2025 YT Focus. Built for focused learning.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component with Description
const FeatureCard = ({ icon, iconBg, title, description }) => (
  <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:border-slate-200 transition-all group">
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default Home;