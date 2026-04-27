import React, { useState, useEffect, useMemo } from 'react';
import { Player, MatchRound, AppState } from './types';
import Header from './components/Header';
import PlayerCard from './components/PlayerCard';
import MatchModal from './components/MatchModal';
import HistoryList from './components/HistoryList';
import SetupView from './components/SetupView';
import Commentary from './components/Commentary';
import ManagePlayersModal from './components/ManagePlayersModal';
import StatsView from './components/StatsView';
import ConfirmModal from './components/ConfirmModal';
import { getMatchCommentary } from './services/geminiService';

const STORAGE_KEY = 'billiard_score_app_v1';

const getInitialState = (): AppState => {
  const emptyState: AppState = { players: [], history: [] };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyState;

    const parsed = JSON.parse(saved) as Partial<AppState>;
    return {
      players: Array.isArray(parsed.players) ? parsed.players : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch (error) {
    console.error('Failed to restore app state:', error);
    localStorage.removeItem(STORAGE_KEY);
    return emptyState;
  }
};

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getInitialState);
  const [activeTab, setActiveTab] = useState<'play' | 'stats'>('play');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDanger: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: false,
  });
  const [commentary, setCommentary] = useState('');
  const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const rankedPlayers = useMemo(
    () => [...state.players].sort((left, right) => right.totalScore - left.totalScore),
    [state.players],
  );

  const triggerHaptic = () => {
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(15);
    }
  };

  const handleSetup = (playerNames: string[]) => {
    triggerHaptic();
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    const newPlayers: Player[] = playerNames.map((name, index) => ({
      id: generateUUID(),
      name,
      totalScore: 0,
      color: colors[index % colors.length],
    }));
    setState({ players: newPlayers, history: [] });
  };

  const handleUpdatePlayers = (updatedPlayers: Player[]) => {
    triggerHaptic();
    setState((prev) => ({
      ...prev,
      players: updatedPlayers,
    }));
  };

  const updateCommentary = async (nextState: AppState = state) => {
    setIsLoadingCommentary(true);
    try {
      const text = await getMatchCommentary(nextState);
      setCommentary(text);
    } finally {
      setIsLoadingCommentary(false);
    }
  };

  const handleAddRound = (changes: { [playerId: string]: number }, winnerId?: string) => {
    triggerHaptic();
    const round: MatchRound = {
      id: generateUUID(),
      timestamp: Date.now(),
      changes: Object.entries(changes).map(([playerId, delta]) => ({ playerId, delta })),
      winnerId,
    };

    const nextState: AppState = {
      players: state.players.map((player) => ({
        ...player,
        totalScore: player.totalScore + (changes[player.id] || 0),
      })),
      history: [round, ...state.history],
    };

    setState(nextState);
    setIsModalOpen(false);
    updateCommentary(nextState);
  };

  const requestSoftReset = () => {
    triggerHaptic();
    setConfirmConfig({
      isOpen: true,
      title: 'Chơi ván mới?',
      message: 'Tất cả điểm số và lịch sử sẽ bị xóa, nhưng danh sách người chơi vẫn được giữ nguyên.',
      isDanger: false,
      onConfirm: () => {
        setState((prev) => ({
          players: prev.players.map((player) => ({ ...player, totalScore: 0 })),
          history: [],
        }));
        setCommentary('');
        setActiveTab('play');
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const requestHardReset = () => {
    triggerHaptic();
    setConfirmConfig({
      isOpen: true,
      title: 'Xóa toàn bộ?',
      message: 'Ứng dụng sẽ xóa tất cả người chơi, lịch sử và quay về màn hình cài đặt ban đầu.',
      isDanger: true,
      onConfirm: () => {
        setState({ players: [], history: [] });
        setCommentary('');
        setActiveTab('play');
        localStorage.removeItem(STORAGE_KEY);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const switchTab = (tab: 'play' | 'stats') => {
    triggerHaptic();
    setActiveTab(tab);
  };

  if (state.players.length === 0) {
    return <SetupView onComplete={handleSetup} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-50 overflow-hidden">
      <Header
        onSoftReset={requestSoftReset}
        onHardReset={requestHardReset}
        onManagePlayers={() => {
          triggerHaptic();
          setIsManageModalOpen(true);
        }}
      />

      <main className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-4 pb-40">
        <div className="max-w-md mx-auto">
          {activeTab === 'play' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Commentary text={commentary} isLoading={isLoadingCommentary} onRefresh={() => updateCommentary()} />

              <section className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-users text-emerald-500"></i>
                    Bảng điểm
                  </h2>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setIsManageModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md active:scale-95 transition-transform"
                  >
                    + THÀNH VIÊN
                  </button>
                </div>
                {rankedPlayers.map((player, index) => (
                  <PlayerCard key={player.id} player={player} rank={index + 1} />
                ))}
              </section>

              <section className="pt-4 border-t border-slate-800">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-history text-blue-500"></i>
                  Lịch sử
                </h2>
                <HistoryList history={state.history} players={state.players} />
              </section>
            </div>
          ) : (
            <StatsView state={state} />
          )}
        </div>
      </main>

      {activeTab === 'play' && (
        <div className="fixed bottom-28 left-0 right-0 p-4 pointer-events-none flex justify-center z-40">
          <button
            onClick={() => {
              triggerHaptic();
              setIsModalOpen(true);
            }}
            className="pointer-events-auto py-4 px-10 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-900/50 transition-all active:scale-95 flex items-center gap-3 border border-emerald-400/20"
          >
            <i className="fas fa-plus"></i>
            VÁN MỚI
          </button>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 px-6 py-4 z-50">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button
            onClick={() => switchTab('play')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'play' ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}
          >
            <i className="fas fa-play-circle text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest text-inherit">Trận đấu</span>
          </button>

          <button
            onClick={() => switchTab('stats')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'stats' ? 'text-blue-500 scale-110' : 'text-slate-500'}`}
          >
            <i className="fas fa-chart-pie text-2xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest text-inherit">Thống kê</span>
          </button>
        </div>
      </nav>

      {isModalOpen && (
        <MatchModal players={state.players} onClose={() => setIsModalOpen(false)} onSubmit={handleAddRound} />
      )}

      {isManageModalOpen && (
        <ManagePlayersModal
          players={state.players}
          onClose={() => setIsManageModalOpen(false)}
          onUpdate={handleUpdatePlayers}
        />
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDanger={confirmConfig.isDanger}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default App;
