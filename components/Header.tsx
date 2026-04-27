import React, { useState } from 'react';

interface HeaderProps {
  onSoftReset: () => void;
  onHardReset: () => void;
  onManagePlayers: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSoftReset, onHardReset, onManagePlayers }) => {
  const [showResetMenu, setShowResetMenu] = useState(false);

  const handleSoftReset = () => {
    setShowResetMenu(false);
    onSoftReset();
  };

  const handleHardReset = () => {
    setShowResetMenu(false);
    onHardReset();
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-800 shadow-lg relative">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-slate-950 font-black text-[10px]">
              8
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-white">Billiard Pro</h1>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Zero-Sum Engine</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onManagePlayers}
            className="p-3 text-slate-400 active:text-blue-400 transition-colors"
            aria-label="Quản lý người chơi"
          >
            <i className="fas fa-users text-lg"></i>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowResetMenu(!showResetMenu)}
              className={`p-3 transition-colors ${showResetMenu ? 'text-emerald-500' : 'text-slate-400 active:text-rose-400'}`}
              aria-label="Menu reset"
            >
              <i className="fas fa-rotate-right text-lg"></i>
            </button>

            {showResetMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowResetMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <button
                    onClick={handleSoftReset}
                    className="w-full px-4 py-5 text-left text-sm font-bold text-slate-200 hover:bg-slate-800 border-b border-slate-800 flex items-center gap-3 active:bg-slate-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <i className="fas fa-redo-alt text-emerald-500"></i>
                    </div>
                    <div>
                      <div>Chơi lại ván mới</div>
                      <div className="text-[10px] text-slate-500 font-normal uppercase">Xóa điểm & lịch sử</div>
                    </div>
                  </button>
                  <button
                    onClick={handleHardReset}
                    className="w-full px-4 py-5 text-left text-sm font-bold text-rose-500 hover:bg-slate-800 flex items-center gap-3 active:bg-slate-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                      <i className="fas fa-trash-can text-rose-500"></i>
                    </div>
                    <div>
                      <div>Xóa tất cả</div>
                      <div className="text-[10px] text-slate-500 font-normal uppercase">Về màn hình cài đặt</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
