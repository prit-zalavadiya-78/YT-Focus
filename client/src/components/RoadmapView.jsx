import React, { useState } from 'react';
import { CheckCircle, Lock, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoadmapView = ({ videos, currentVideoId, onVideoSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Find current video index
  const currentIndex = videos.findIndex(v => v._id === currentVideoId);
  
  // Show: completed videos + current + next 2 (or all if expanded)
  const getVisibleVideos = () => {
    if (isExpanded) return videos;
    
    // Show current video and 2 before/after
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(videos.length, currentIndex + 3);
    return videos.slice(start, end);
  };
  
  const visibleVideos = getVisibleVideos();
  const hiddenCount = videos.length - visibleVideos.length;
  const completedCount = videos.filter(v => v.watched).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Course Progress</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {completedCount} of {videos.length} completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {Math.round((completedCount / videos.length) * 100)}%
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / videos.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Video List */}
      <div className="max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {visibleVideos.map((video, index) => {
            const actualIndex = videos.findIndex(v => v._id === video._id);
            const isLocked = !video.watched && !video.isCurrent;
            const isCompleted = video.watched;
            const isActive = video._id === currentVideoId;

            return (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !isLocked && onVideoSelect(video._id)}
                className={`flex items-center gap-3 p-4 border-b border-slate-100 cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                    : isLocked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-slate-50'
                }`}
              >
                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isActive 
                      ? 'bg-blue-600' 
                      : 'bg-slate-200'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : isLocked ? (
                    <Lock className="w-3 h-3 text-slate-400" />
                  ) : (
                    <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${
                    isActive ? 'text-blue-700' : isLocked ? 'text-slate-400' : 'text-slate-800'
                  }`}>
                    {actualIndex + 1}. {video.title}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                    {video.duration || 10} min • {isCompleted ? '✓ Done' : isActive ? 'Now Playing' : 'Locked'}
                  </p>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse Button */}
      {videos.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All {videos.length} Videos
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default RoadmapView;