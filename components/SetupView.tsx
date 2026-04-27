import React, { useState } from 'react';

interface SetupViewProps {
  onComplete: (names: string[]) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ onComplete }) => {
  const [names, setNames] = useState<string[]>(['', '']);

  const addField = () => {
    if (names.length < 6) setNames([...names, '']);
  };

  const removeField = (index: number) => {
    if (names.length > 2) {
      setNames(names.filter((_, currentIndex) => currentIndex !== index));
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const nextNames = [...names];
    nextNames[index] = value;
    setNames(nextNames);
  };

  const cleanedNames = names.map((name) => name.trim()).filter(Boolean);
  const isReady = cleanedNames.length >= 2;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-slate-900 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-black border-4 border-slate-800 relative">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-950 font-black text-2xl">8</div>
            <div className="absolute top-2 right-4 w-4 h-2 bg-white/10 rounded-full blur-[2px] rotate-45"></div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mt-4">Billiard Pro</h1>
          <p className="text-slate-400">Thiết lập người chơi để bắt đầu đếm điểm.</p>
        </div>

        <div className="space-y-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-2">Tên người chơi</h2>
          {names.map((name, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  autoFocus={index === names.length - 1}
                  placeholder={`Người chơi ${index + 1}`}
                  value={name}
                  onChange={(event) => handleNameChange(index, event.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                />
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/30 rounded-l-xl"></div>
              </div>
              <button onClick={() => removeField(index)} className="p-3 text-slate-500 hover:text-rose-400 transition-colors">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}

          {names.length < 6 && (
            <button
              onClick={addField}
              className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 transition-all font-bold flex items-center justify-center gap-2"
            >
              <i className="fas fa-user-plus"></i>
              THÊM NGƯỜI
            </button>
          )}
        </div>

        <button
          disabled={!isReady}
          onClick={() => onComplete(cleanedNames)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl font-black text-xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95"
        >
          BẮT ĐẦU NGAY
        </button>
      </div>
    </div>
  );
};

export default SetupView;
