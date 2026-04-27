import React from 'react';
import { Player, MatchRound } from '../types';

interface TrendChartProps {
  history: MatchRound[];
  players: Player[];
}

const TrendChart: React.FC<TrendChartProps> = ({ history, players }) => {
  if (history.length < 1) return null;

  const chronologicalHistory = [...history].reverse();
  const dataPoints = [players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {} as Record<string, number>)];

  let currentScores = { ...dataPoints[0] };
  chronologicalHistory.forEach((round) => {
    const nextScores = { ...currentScores };
    round.changes.forEach((change) => {
      nextScores[change.playerId] = (nextScores[change.playerId] || 0) + change.delta;
    });
    dataPoints.push(nextScores);
    currentScores = nextScores;
  });

  const width = 400;
  const height = 200;
  const padding = 30;
  const allScores = dataPoints.flatMap((point) => Object.values(point));
  const minScore = Math.min(...allScores, -10);
  const maxScore = Math.max(...allScores, 10);
  const scoreRange = maxScore - minScore;

  const getX = (index: number) => padding + (index * (width - 2 * padding)) / (dataPoints.length - 1 || 1);
  const getY = (score: number) => height - padding - ((score - minScore) * (height - 2 * padding)) / (scoreRange || 1);

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-3xl overflow-hidden">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Biểu đồ xu hướng</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <line x1={padding} y1={getY(0)} x2={width - padding} y2={getY(0)} stroke="#334155" strokeWidth="1" strokeDasharray="4" />

        {players.map((player) => {
          const points = dataPoints.map((point, index) => `${getX(index)},${getY(point[player.id] || 0)}`).join(' ');
          const lastScore = dataPoints[dataPoints.length - 1]?.[player.id] || 0;

          return (
            <g key={player.id}>
              <polyline
                fill="none"
                stroke={player.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="transition-all duration-500"
              />
              <circle cx={getX(dataPoints.length - 1)} cy={getY(lastScore)} r="4" fill={player.color} className="animate-pulse" />
            </g>
          );
        })}

        <text x={padding} y={height - 5} fill="#64748b" fontSize="10" textAnchor="middle">Bắt đầu</text>
        <text x={width - padding} y={height - 5} fill="#64748b" fontSize="10" textAnchor="middle">Hiện tại</text>
      </svg>

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }}></div>
            <span className="text-[10px] font-medium text-slate-400">{player.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;
