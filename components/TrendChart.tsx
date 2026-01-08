
import React from 'react';
import { Player, MatchRound } from '../types';

interface TrendChartProps {
  history: MatchRound[];
  players: Player[];
}

const TrendChart: React.FC<TrendChartProps> = ({ history, players }) => {
  if (history.length < 1) return null;

  // Reverse history to get chronological order and calculate cumulative scores
  const chronologicalHistory = [...history].reverse();
  const dataPoints = [
    players.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {} as Record<string, number>)
  ];

  let currentScores = { ...dataPoints[0] };
  chronologicalHistory.forEach(round => {
    const nextScores = { ...currentScores };
    round.changes.forEach(change => {
      nextScores[change.playerId] = (nextScores[change.playerId] || 0) + change.delta;
    });
    dataPoints.push(nextScores);
    currentScores = nextScores;
  });

  const width = 400;
  const height = 200;
  const padding = 30;

  // Find scale
  const allScores = dataPoints.flatMap(d => Object.values(d));
  const minScore = Math.min(...allScores, -10);
  const maxScore = Math.max(...allScores, 10);
  const scoreRange = maxScore - minScore;

  const getX = (index: number) => padding + (index * (width - 2 * padding) / (dataPoints.length - 1 || 1));
  const getY = (score: number) => height - padding - ((score - minScore) * (height - 2 * padding) / (scoreRange || 1));

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-3xl overflow-hidden">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Biểu đồ xu hướng</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid Lines */}
        <line x1={padding} y1={getY(0)} x2={width - padding} y2={getY(0)} stroke="#334155" strokeWidth="1" strokeDasharray="4" />
        
        {/* Player Lines */}
        {players.map(player => {
          const points = dataPoints.map((d, i) => `${getX(i)},${getY(d[player.id] || 0)}`).join(' ');
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
              {/* Last point indicator */}
              <circle
                cx={getX(dataPoints.length - 1)}
                cy={getY(dataPoints[player.id] || 0)}
                r="4"
                fill={player.color}
                className="animate-pulse"
              />
            </g>
          );
        })}

        {/* Labels for X axis */}
        <text x={padding} y={height - 5} fill="#64748b" fontSize="10" textAnchor="middle">Bắt đầu</text>
        <text x={width - padding} y={height - 5} fill="#64748b" fontSize="10" textAnchor="middle">Hiện tại</text>
      </svg>
      
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {players.map(p => (
          <div key={p.id} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
            <span className="text-[10px] font-medium text-slate-400">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;
