import React from 'react';

interface CommentaryProps {
  text: string;
  isLoading: boolean;
  onRefresh: () => void;
}

const Commentary: React.FC<CommentaryProps> = ({ text, isLoading, onRefresh }) => {
  if (!text && !isLoading) return null;

  return (
    <div className="relative overflow-hidden bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-4 animate-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1">
          <i className="fas fa-robot"></i>
          AI Bình Luận Viên
        </span>
        <button onClick={onRefresh} disabled={isLoading} className="text-emerald-600 hover:text-emerald-400 disabled:opacity-30">
          <i className={`fas fa-sync-alt text-xs ${isLoading ? 'animate-spin' : ''}`}></i>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2 py-1">
          <div className="h-4 bg-emerald-900/20 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-emerald-900/20 rounded animate-pulse w-2/3"></div>
        </div>
      ) : (
        <p className="text-sm font-medium text-emerald-100 italic">"{text}"</p>
      )}

      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
        <i className="fas fa-comment-dots text-7xl text-emerald-400 rotate-12"></i>
      </div>
    </div>
  );
};

export default Commentary;
