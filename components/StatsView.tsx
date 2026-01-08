
import React from 'react';
import { AppState, Player } from '../types';
import TrendChart from './TrendChart';

interface StatsViewProps {
  state: AppState;
}

const StatsView: React.FC<StatsViewProps> = ({ state }) => {
  const { players, history } = state;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
        <i className="fas fa-chart-line text-5xl opacity-20"></i>
        <p className="font-medium">Chưa có đủ dữ liệu để phân tích</p>
      </div>
    );
  }

  // Calculate some fun stats
  const playerStats = players.map(p => {
    const pHistory = history.map(h => h.changes.find(c => c.playerId === p.id)?.delta || 0);
    const winCount = pHistory.filter(d => d > 0).length;
    const lossCount = pHistory.filter(d => d < 0).length;
    const biggestWin = Math.max(...pHistory, 0);
    
    // Status Logic
    let status = "Bình thường";
    const lastThree = [...pHistory].reverse().slice(-3);
    const trendSum = lastThree.reduce((a, b) => a + b, 0);
    if (trendSum > 15) status = "Đang vào form 🔥";
    else if (trendSum < -15) status = "Vận đen đeo bám 💀";
    else if (lastThree.every(v => v > 0) && lastThree.length >= 2) status = "Chuỗi thắng 🚀";
    else if (p.totalScore > 20) status = "Đại gia Billiard 👑";
    else if (p.totalScore < -20) status = "Nhà từ thiện 💸";

    return { ...p, winCount, lossCount, biggestWin, status };
  });

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <TrendChart history={history} players={players} />

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Phân tích trạng thái</h3>
        {playerStats.sort((a, b) => b.totalScore - a.totalScore).map((p, idx) => (
          <div key={p.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: p.color + '15', color: p.color }}
              >
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-100">{p.name}</h4>
                <p className={`text-xs font-semibold ${p.status.includes('form') || p.status.includes('thắng') ? 'text-emerald-400' : p.status.includes('đen') ? 'text-rose-400' : 'text-blue-400'}`}>
                  {p.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Thắng/Bại</div>
              <div className="flex gap-1 text-[10px] font-bold">
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">{p.winCount}W</span>
                <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 rounded">{p.lossCount}L</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl">
        <div className="flex items-center gap-3 mb-3">
          <i className="fas fa-lightbulb text-blue-400"></i>
          <h3 className="font-bold text-blue-100">Tổng kết nhanh</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex justify-between">
            <span>Tổng số ván đã chơi:</span>
            <span className="font-bold text-white">{history.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Người "nổ hũ" to nhất:</span>
            <span className="font-bold text-emerald-400">
              {playerStats.reduce((prev, current) => (prev.biggestWin > current.biggestWin) ? prev : current).name}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Trận đấu kịch tính:</span>
            <span className="font-bold text-white">
              {Math.abs(playerStats[0].totalScore - playerStats[players.length-1].totalScore) < 10 ? 'Cực kỳ cân bằng' : 'Chênh lệch rõ rệt'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StatsView;
