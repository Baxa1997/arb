"use client"
import { useState } from 'react';
export default function QuizBlock({ letter }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);

  if (!letter.quiz || letter.quiz.length === 0) {
    return <div className="text-white/50 text-center p-8 bg-[#141d2e] rounded-3xl">Bu harf uchun hozircha test mavjud emas.</div>;
  }

  const quiz = letter.quiz[currentQ];
  const isAnswered = selected !== null;
  const isCorrect = selected === quiz.correct;

  const handleNext = () => {
    if (currentQ < letter.quiz.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
    }
  };

  return (
    <div className="bg-[#141d2e] border border-white/5 rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-white/50 text-sm font-medium">Test {currentQ + 1} / {letter.quiz.length}</span>
        <span className="text-[#f59e0b] font-bold text-sm bg-yellow-500/10 px-3 py-1 rounded-full">{letter.name}</span>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="font-arabic text-8xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-6">
          {letter.ar}
        </div>
        <h3 className="text-xl md:text-2xl text-center text-white/90 font-medium">{quiz.question}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {quiz.options.map((opt, idx) => {
          let btnClass = "bg-[#111827] border border-white/10 hover:bg-white/5 text-white/80";
          if (isAnswered) {
             if (idx === quiz.correct) {
               btnClass = "bg-[#10b981]/20 border-[#10b981] text-accent font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]";
             } else if (idx === selected) {
               btnClass = "bg-red-500/20 border-red-500 text-red-400 font-bold";
             } else {
               btnClass = "bg-[#111827] border-white/5 text-white/30 opacity-50";
             }
          } else {
             if (selected === idx) {
                // Should not happen since we evaluate immediately, but just in case
                btnClass = "border-[#6366f1] bg-[#6366f1]/20";
             }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => setSelected(idx)}
              className={`p-4 rounded-2xl transition-all duration-300 text-lg ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isAnswered && (
         <div className="flex justify-between items-center bg-[#111827] p-4 rounded-2xl border border-white/5 animate-fade-in-up">
            <span className={`font-bold ${isCorrect ? 'text-[#10b981]' : 'text-red-400'}`}>
              {isCorrect ? 'Tahsin! To\'g\'ri javob.' : 'Xato qildingiz, qayta urinib ko\'ring.'}
            </span>
            {currentQ < letter.quiz.length - 1 && (
              <button 
                onClick={handleNext}
                className="bg-[#10b981] hover:bg-[#0ea5e9] text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              >
                Keyingi savol →
              </button>
            )}
         </div>
      )}
    </div>
  );
}
