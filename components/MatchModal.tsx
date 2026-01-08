
import React, { useState, useEffect } from 'react';
import { Player } from '../types';

interface MatchModalProps {
  players: Player[];
  onClose: () => void;
  onSubmit: (changes: { [playerId: string]: number }) => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ players, onClose, onSubmit }) => {
  const [deltas, setDeltas] = useState<{ [playerId: string]: number }>(
    players.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {})
  );

  const sum = (Object.values(deltas) as number[]).reduce((a: number, b: number) => a + b, 0);
  const isValid = sum === 0;

  const handleChange = (playerId: string, value: string) => {
    const num = parseInt(value) || 0;
    setDeltas(prev => ({ ...prev, [playerId]: num }));
  };

  const handleQuickAdd = (playerId: string, amount: number) => {
    setDeltas(prev => ({ ...prev, [playerId]: (prev[playerId] || 0) + amount }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border-t border-slate-800 sm:border animate-in slide-in-from-bottom duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Thêm Kết Quả Ván</h2>
            <button onClick={onClose} className="text-slate-400 p-2"><i className="fas fa-times"></i></button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {players.map(player => {
              const currentPos = player.totalScore > 0;
              const currentNeg = player.totalScore < 0;
              
              return (
                <div key={player.id} className="bg-slate-800/30 p-4 rounded-xl space-y-3 border border-slate-800/50">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold flex items-center gap-2 text-slate-100">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }}></span>
                        {player.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng:</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-950/50 ${currentPos ? 'text-emerald-400' : currentNeg ? 'text-rose-400' : 'text-slate-500'}`}>
                          {currentPos ? `+${player.totalScore}` : player.totalScore}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={deltas[player.id] === 0 ? '' : deltas[player.id]}
                        placeholder="0"
                        onChange={(e) => handleChange(player.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 w-28 text-right font-black text-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[-10, -5, 5, 10].map(val => (
                      <button
                        key={val}
                        onClick={() => handleQuickAdd(player.id, val)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all active:scale-95 ${
                          val > 0 
                          ? 'border-emerald-900/30 bg-emerald-900/10 text-emerald-400 active:bg-emerald-900/30' 
                          : 'border-rose-900/30 bg-rose-900/10 text-rose-400 active:bg-rose-900/30'
                        }`}
                      >
                        {val > 0 ? `+${val}` : val}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-400 text-sm font-medium">Tổng chênh lệch (Cần = 0):</span>
              <span className={`text-xl font-black ${isValid ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                {sum > 0 ? `+${sum}` : sum}
              </span>
            </div>

            <button
              disabled={!isValid || Object.values(deltas).every(v => v === 0)}
              onClick={() => onSubmit(deltas)}
              className="w-full py-4 rounded-2xl bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-lg transition-all active:scale-95 shadow-lg shadow-emerald-950/30 text-white"
            >
              LƯU KẾT QUẢ
            </button>
            
            {!isValid && (
              <p className="text-center text-xs text-rose-400 flex items-center justify-center gap-2 animate-bounce">
                <i className="fas fa-circle-exclamation"></i>
                Lỗi: Tổng điểm cộng lại phải bằng 0!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
