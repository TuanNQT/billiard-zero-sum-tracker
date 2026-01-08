
import React from 'react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  rank: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank }) => {
  const isPositive = player.totalScore > 0;
  const isNegative = player.totalScore < 0;

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl relative"
          style={{ backgroundColor: player.color + '20', color: player.color }}
        >
          {player.name[0].toUpperCase()}
          {rank === 1 && (
            <div className="absolute -top-2 -right-2 text-yellow-500 text-sm">
              <i className="fas fa-crown"></i>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">{player.name}</h3>
          <p className="text-xs text-slate-500 capitalize">Hạng {rank}</p>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`}>
          {isPositive && '+'}{player.totalScore}
        </div>
        <div className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Điểm tổng</div>
      </div>
    </div>
  );
};

export default PlayerCard;
