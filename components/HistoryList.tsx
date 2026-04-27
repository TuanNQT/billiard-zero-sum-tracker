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
      {history.map((round, index) => {
        const winner = round.winnerId ? players.find((player) => player.id === round.winnerId) : null;

        return (
          <div key={round.id} className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
                  Ván {history.length - index}
                </span>
                {winner && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-800/50" style={{ color: winner.color }}>
                    🏆 {winner.name}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">
                {new Date(round.timestamp).toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                })}
              </span>
            </div>

            <div className="space-y-2">
              {round.changes.map((change) => {
                const player = players.find((item) => item.id === change.playerId);
                if (!player) return null;

                const isPositive = change.delta > 0;
                const isNegative = change.delta < 0;

                return (
                  <div key={player.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: player.color }}></span>
                      <span className="text-slate-300 truncate">{player.name}</span>
                    </div>
                    <span className={`font-bold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-500'}`}>
                      {isPositive ? `+${change.delta}` : change.delta}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
