import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <h4 className="font-bold text-slate-900">YT Focus</h4>
          <p className="text-slate-500 text-sm mt-1">
            Built for the TeckSprint Hackathon 2026
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        <div className="text-sm text-slate-400 flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-current" />
        </div>

      </div>
    </footer>
  );
};

export default Footer;
