import React, { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';

const NotesEditor = ({ note, onSave }) => {
  const [content, setContent] = useState(note || "");

  // ✅ FIX: This forces the text box to update when you switch videos
  useEffect(() => {
    setContent(note || "");
  }, [note]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-slate-500" />
        <h3 className="font-bold text-slate-700 text-sm">My Notes</h3>
      </div>
      
      {/* Text Area */}
      <textarea
        className="flex-1 p-4 resize-none outline-none text-slate-600 text-sm leading-relaxed font-mono"
        placeholder="Type your notes here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Save Button */}
      <div className="p-3 border-t border-slate-100">
        <button 
          onClick={() => onSave(content)}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          <Save className="w-4 h-4" /> Save Notes
        </button>
      </div>
    </div>
  );
};

export default NotesEditor;