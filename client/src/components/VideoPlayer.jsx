import React from 'react';
import { Play, CheckCircle } from 'lucide-react';

const VideoPlayer = ({ url, onComplete }) => {
  // Helper to get the ID from any YouTube URL
  const getVideoId = (link) => {
    if (!link) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-white">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* 1. The Direct Iframe (No Libraries) */}
      <div className="relative w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 2. Manual Complete Button (Since Iframe can't talk to React easily) */}
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
        <span className="text-slate-400 text-sm">
          Watch the video, then click to take the quiz.
        </span>
        <button 
          onClick={onComplete}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-green-900/20"
        >
          <CheckCircle className="w-5 h-5" />
          Finish Lesson
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;