
import React from 'react';
import { MatchRound, Player } from '../types';

interface HistoryListProps {
  history: MatchRound[];
  players: Player[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history, players }) => {
  if (history.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-3 border-2 border-dashed border-slate-800 rounded-3xl">
        <i className="fas fa-ghost text-4xl"></i>
        <p className="font-medium">Chưa có trận đấu nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((round) => (
        <div key={round.id} className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
              Ván {history.length - history.indexOf(round)}
            </span>
            <span className="text-xs text-slate-600">
              {new Date(round.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {round.changes.map(change => {
              const player = players.find(p => p.id === change.playerId);
              const isPositive = change.delta > 0;
              const isNegative = change.delta < 0;
              return (
                <div key={change.playerId} className="flex items-center justify-between bg-slate-800/20 p-2 rounded-lg border border-slate-800">
                  <span className="text-sm font-medium text-slate-400 truncate max-w-[80px]">
                    {player?.name || 'Unknown'}
                  </span>
                  <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-600'}`}>
                    {isPositive ? `+${change.delta}` : change.delta}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
