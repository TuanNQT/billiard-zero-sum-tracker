import React, { useMemo, useState } from 'react';
import { Player } from '../types';

const numberInputStyles = `
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

interface MatchModalProps {
  players: Player[];
  onClose: () => void;
  onSubmit: (changes: { [playerId: string]: number }, winnerId?: string) => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ players, onClose, onSubmit }) => {
  const [deltas, setDeltas] = useState<{ [playerId: string]: number }>(
    players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {}),
  );
  const [deltaTexts, setDeltaTexts] = useState<{ [playerId: string]: string }>(
    players.reduce((acc, player) => ({ ...acc, [player.id]: '' }), {}),
  );
  const [winnerId, setWinnerId] = useState('');

  const emptyPlayerIds = players.filter((player) => deltaTexts[player.id] === '').map((player) => player.id);
  const filledPlayerIds = players.filter((player) => deltaTexts[player.id] !== '').map((player) => player.id);

  const autoFillPlayerId = emptyPlayerIds.length === 1 && filledPlayerIds.length >= 1 ? emptyPlayerIds[0] : null;
  const sumOfFilled = filledPlayerIds.reduce((total, playerId) => total + (deltas[playerId] || 0), 0);
  const autoFillValue = autoFillPlayerId !== null ? -sumOfFilled : null;

  const effectiveDeltas = useMemo(() => {
    const next = { ...deltas };
    if (autoFillPlayerId !== null && autoFillValue !== null) {
      next[autoFillPlayerId] = autoFillValue;
    }
    return next;
  }, [autoFillPlayerId, autoFillValue, deltas]);

  const effectiveSum = useMemo(
    () => Object.values(effectiveDeltas).reduce((total, value) => total + value, 0),
    [effectiveDeltas],
  );
  const isValid = effectiveSum === 0;
  const hasNonZeroDeltas = Object.values(effectiveDeltas).some((value) => value !== 0);
  const showAutoFill = autoFillPlayerId !== null && autoFillValue !== null;

  const handleChange = (playerId: string, value: string) => {
    if (!/^-?\d*$/.test(value)) return;

    setDeltaTexts((prev) => ({ ...prev, [playerId]: value }));
    const nextValue = value === '' || value === '-' ? 0 : Number.parseInt(value, 10) || 0;
    setDeltas((prev) => ({ ...prev, [playerId]: nextValue }));
  };

  const handleQuickAdd = (playerId: string, amount: number) => {
    setDeltas((prev) => {
      const nextValue = (prev[playerId] || 0) + amount;
      setDeltaTexts((prevTexts) => ({
        ...prevTexts,
        [playerId]: nextValue === 0 ? '' : String(nextValue),
      }));
      return { ...prev, [playerId]: nextValue };
    });
  };

  const handleApplyAutoFill = (playerId: string) => {
    if (autoFillValue === null) return;
    setDeltas((prev) => ({ ...prev, [playerId]: autoFillValue }));
    setDeltaTexts((prev) => ({
      ...prev,
      [playerId]: autoFillValue === 0 ? '0' : String(autoFillValue),
    }));
  };

  const handleSubmit = () => {
    const finalDeltas = { ...deltas };
    if (autoFillPlayerId !== null && autoFillValue !== null && deltaTexts[autoFillPlayerId] === '') {
      finalDeltas[autoFillPlayerId] = autoFillValue;
    }
    onSubmit(finalDeltas, winnerId || undefined);
  };

  const formatWithSign = (value: number) => (value > 0 ? `+${value}` : `${value}`);

  return (
    <>
      <style>{numberInputStyles}</style>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border-t border-slate-800 sm:border animate-in slide-in-from-bottom duration-300">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Thêm kết quả ván</h2>
              <button onClick={onClose} className="text-slate-400 p-2">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {players.map((player) => {
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
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-950/50 ${
                              currentPos ? 'text-emerald-400' : currentNeg ? 'text-rose-400' : 'text-slate-500'
                            }`}
                          >
                            {currentPos ? `+${player.totalScore}` : player.totalScore}
                          </span>
                        </div>
                      </div>
                      <div className="relative flex items-center gap-1">
                        <button
                          onClick={() => handleQuickAdd(player.id, -1)}
                          className="border-2 border-slate-600 hover:border-rose-500 text-slate-400 hover:text-rose-400 rounded-md py-1 px-2.5 font-bold text-lg transition-all active:scale-95"
                        >
                          -
                        </button>
                        <input
                          inputMode="numeric"
                          pattern="-?[0-9]*"
                          type="text"
                          value={deltaTexts[player.id] ?? ''}
                          onChange={(event) => handleChange(player.id, event.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded-lg py-1 px-3 w-20 text-center font-black text-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner"
                          style={{ WebkitAppearance: 'textfield', MozAppearance: 'textfield' }}
                        />
                        <button
                          onClick={() => handleQuickAdd(player.id, 1)}
                          className="border-2 border-slate-600 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 rounded-md py-1 px-2.5 font-bold text-lg transition-all active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {[-3, -2, 2, 3].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleQuickAdd(player.id, value)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all active:scale-95 ${
                            value > 0
                              ? 'border-emerald-900/30 bg-emerald-900/10 text-emerald-400 active:bg-emerald-900/30'
                              : 'border-rose-900/30 bg-rose-900/10 text-rose-400 active:bg-rose-900/30'
                          }`}
                        >
                          {value > 0 ? `+${value}` : value}
                        </button>
                      ))}
                    </div>

                    {showAutoFill && player.id === autoFillPlayerId && deltaTexts[player.id] === '' && (
                      <div className="flex items-center gap-1.5 animate-in fade-in duration-300">
                        <button
                          onClick={() => handleApplyAutoFill(player.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full cursor-pointer hover:bg-amber-500/20 hover:border-amber-500/40 active:scale-95 transition-all"
                        >
                          <i className="fas fa-bolt text-[9px]"></i>
                          Tự động khớp: {formatWithSign(autoFillValue)}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
              <div className="space-y-3">
                <span className="text-slate-400 text-sm font-medium block">Người thắng ván:</span>
                <div className="flex gap-3 flex-wrap">
                  {players.map((player) => (
                    <label key={player.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="winner"
                        value={player.id}
                        checked={winnerId === player.id}
                        onChange={(event) => setWinnerId(event.target.value)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-2 text-slate-200" style={{ color: winnerId === player.id ? player.color : 'inherit' }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }}></span>
                        {player.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-slate-400 text-sm font-medium">Tổng chênh lệch (cần = 0):</span>
                <span className={`text-xl font-black ${isValid ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                  {effectiveSum > 0 ? `+${effectiveSum}` : effectiveSum}
                  {showAutoFill && autoFillValue !== 0 && <span className="text-xs text-amber-400 ml-1 font-medium">⚡</span>}
                </span>
              </div>

              <button
                disabled={!isValid || !hasNonZeroDeltas || !winnerId}
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-lg transition-all active:scale-95 shadow-lg shadow-emerald-950/30 text-white"
              >
                LƯU KẾT QUẢ
              </button>

              {!isValid && (
                <p className="text-center text-xs text-rose-400 flex items-center justify-center gap-2 animate-bounce">
                  <i className="fas fa-circle-exclamation"></i>
                  Lỗi: tổng điểm cộng lại phải bằng 0.
                </p>
              )}

              {isValid && hasNonZeroDeltas && !winnerId && (
                <p className="text-center text-xs text-amber-400 flex items-center justify-center gap-2">
                  <i className="fas fa-trophy"></i>
                  Vui lòng chọn người thắng ván để lưu kết quả.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchModal;
