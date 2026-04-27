import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-xs rounded-3xl shadow-2xl border border-slate-800 p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
              isDanger ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
            }`}
          >
            {confirmText}
          </button>
          <button onClick={onCancel} className="w-full py-4 rounded-2xl font-bold bg-slate-800 text-slate-300 active:bg-slate-700 transition-all">
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
