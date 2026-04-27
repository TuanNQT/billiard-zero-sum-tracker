import React from 'react';
import { AppState } from '../types';
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

  const playerStats = players.map((player) => {
    const playerHistory = history.map((round) => round.changes.find((change) => change.playerId === player.id)?.delta || 0);
    const winCount = playerHistory.filter((delta) => delta > 0).length;
    const lossCount = playerHistory.filter((delta) => delta < 0).length;
    const biggestWin = Math.max(...playerHistory, 0);

    let status = 'Bình thường';
    const recentRounds = playerHistory.slice(0, 3);
    const trendSum = recentRounds.reduce((total, value) => total + value, 0);

    if (trendSum > 15) status = 'Đang vào form 🔥';
    else if (trendSum < -15) status = 'Vận đen đeo bám 💀';
    else if (recentRounds.every((value) => value > 0) && recentRounds.length >= 2) status = 'Chuỗi thắng 🚀';
    else if (player.totalScore > 20) status = 'Đại gia Billiard 👑';
    else if (player.totalScore < -20) status = 'Nhà từ thiện 💸';

    return { ...player, winCount, lossCount, biggestWin, status };
  });

  const sortedStats = [...playerStats].sort((left, right) => right.totalScore - left.totalScore);
  const biggestSwingPlayer = playerStats.reduce((previous, current) => (previous.biggestWin > current.biggestWin ? previous : current));
  const scoreGap = Math.abs(sortedStats[0].totalScore - sortedStats[sortedStats.length - 1].totalScore);

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <TrendChart history={history} players={players} />

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Phân tích trạng thái</h3>
        {sortedStats.map((player, index) => (
          <div key={player.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ backgroundColor: player.color + '15', color: player.color }}>
                {index + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-100">{player.name}</h4>
                <p
                  className={`text-xs font-semibold ${
                    player.status.includes('form') || player.status.includes('thắng')
                      ? 'text-emerald-400'
                      : player.status.includes('đen')
                        ? 'text-rose-400'
                        : 'text-blue-400'
                  }`}
                >
                  {player.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Thắng/Bại</div>
              <div className="flex gap-1 text-[10px] font-bold">
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">{player.winCount}W</span>
                <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 rounded">{player.lossCount}L</span>
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
            <span>Người “nổ hũ” to nhất:</span>
            <span className="font-bold text-emerald-400">{biggestSwingPlayer.name}</span>
          </li>
          <li className="flex justify-between">
            <span>Trận đấu kịch tính:</span>
            <span className="font-bold text-white">{scoreGap < 10 ? 'Cực kỳ cân bằng' : 'Chênh lệch rõ rệt'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StatsView;
