
import React, { useState } from 'react';
import { Player } from '../types';

// Polyfill for crypto.randomUUID if not available
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface ManagePlayersModalProps {
  players: Player[];
  onClose: () => void;
  onUpdate: (updatedPlayers: Player[]) => void;
}

const ManagePlayersModal: React.FC<ManagePlayersModalProps> = ({ players, onClose, onUpdate }) => {
  const [localPlayers, setLocalPlayers] = useState<Player[]>([...players]);
  const [newName, setNewName] = useState('');

  const handleAddPlayer = () => {
    if (newName.trim()) {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const newPlayer: Player = {
        id: generateUUID(),
        name: newName.trim(),
        totalScore: 0,
        color: colors[localPlayers.length % colors.length]
      };
      const updated = [...localPlayers, newPlayer];
      setLocalPlayers(updated);
      setNewName('');
    }
  };

  const handleRemovePlayer = (id: string) => {
    const player = localPlayers.find(p => p.id === id);
    if (player && player.totalScore !== 0) {
      if (!confirm(`Người chơi này đang có ${player.totalScore} điểm. Xóa họ sẽ làm mất cân bằng tổng điểm = 0. Bạn vẫn muốn xóa?`)) {
        return;
      }
    }
    setLocalPlayers(localPlayers.filter(p => p.id !== id));
  };

  const handleSave = () => {
    onUpdate(localPlayers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <i className="fas fa-users-cog text-blue-500"></i>
              Quản lý người chơi
            </h2>
            <button onClick={onClose} className="text-slate-400 p-2"><i className="fas fa-times"></i></button>
          </div>

          <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
            {localPlayers.map(p => {
              const isPositive = p.totalScore > 0;
              const isNegative = p.totalScore < 0;
              
              return (
                <div key={p.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold" style={{ backgroundColor: p.color + '20', color: p.color }}>
                      {p.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-black px-2 py-1 rounded-md bg-slate-950/50 min-w-[40px] text-center ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-500'}`}>
                      {isPositive ? `+${p.totalScore}` : p.totalScore}
                    </span>
                    <button 
                      onClick={() => handleRemovePlayer(p.id)}
                      className="text-slate-500 hover:text-rose-500 p-2 transition-colors"
                      title="Xóa người chơi"
                    >
                      <i className="fas fa-user-minus"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tên người chơi mới..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
              />
              <button 
                onClick={handleAddPlayer}
                disabled={!newName.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 p-3 rounded-xl transition-all aspect-square flex items-center justify-center"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold shadow-lg transition-all active:scale-95 text-white"
            >
              XÁC NHẬN THAY ĐỔI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePlayersModal;
