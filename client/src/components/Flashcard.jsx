import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, RotateCw, Lightbulb } from 'lucide-react';

const Flashcard = ({ front, back, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <>
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Custom thin scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.3);
            border-radius: 20px;
        }
      `}</style>
      
      <div 
        className="relative w-full h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative transform-style-3d transition-all duration-500"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* --- FRONT SIDE --- */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all group overflow-hidden flex flex-col">
             
             {/* 1. Static Header */}
             <div className="flex justify-between items-start p-4 pb-2 shrink-0">
               <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">
                 #{index + 1}
               </span>
               <div className="bg-blue-50 p-2 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                 <Zap className="w-4 h-4" />
               </div>
             </div>

             {/* 2. Scrollable Content Area */}
             <div className="flex-1 overflow-y-auto custom-scrollbar w-full relative">
               <div className="min-h-full flex items-center justify-center p-6 py-2">
                 <h3 className="text-lg font-semibold text-slate-700 leading-relaxed text-center">
                   {front}
                 </h3>
               </div>
             </div>

             {/* 3. Static Footer */}
             <div className="p-3 pt-2 text-center shrink-0">
               <div className="text-xs text-slate-400 flex items-center justify-center gap-1 opacity-70">
                 <RotateCw className="w-3 h-3" /> Tap to reveal
               </div>
             </div>
          </div>

          {/* --- BACK SIDE --- */}
          <div className="absolute inset-0 backface-hidden bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-800 rotate-y-180 overflow-hidden flex flex-col">
             
             {/* 1. Static Header */}
             <div className="flex items-center p-4 pb-2 shrink-0">
               <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-1 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                 <Lightbulb className="w-3 h-3" /> Answer
               </span>
             </div>

             {/* 2. Scrollable Content Area */}
             <div className="flex-1 overflow-y-auto custom-scrollbar w-full relative">
               <div className="min-h-full flex items-center justify-center p-6 py-2">
                  <p className="text-sm md:text-base font-medium text-slate-200 leading-7 text-center">
                    {back}
                  </p>
               </div>
             </div>

             {/* 3. Static Footer */}
             <div className="p-3 pt-2 text-center shrink-0">
               <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                 <RotateCw className="w-3 h-3" /> Tap to flip back
               </div>
             </div>
          </div>

        </motion.div>
      </div>
    </>
  );
};

export default Flashcard;
