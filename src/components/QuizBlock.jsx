"use client"
import { useState } from 'react';
export default function QuizBlock({ letter }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);

  if (!letter.quiz || letter.quiz.length === 0) {
    return <div className="text-brand-700/50 text-center p-8 bg-cream-50 border border-brand-700/10 rounded-3xl">Bu harf uchun hozircha test mavjud emas.</div>;
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
    <div className="bg-cream-50 border border-brand-700/10 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <span className="text-brand-700/50 text-sm font-medium">Test {currentQ + 1} / {letter.quiz.length}</span>
        <span className="text-brand-600 font-bold text-sm bg-brand-500/10 px-3 py-1 rounded-full">{letter.name}</span>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="font-arabic text-8xl md:text-9xl text-brand-700 mb-6">
          {letter.ar}
        </div>
        <h3 className="text-xl md:text-2xl text-center text-brand-700 font-medium">{quiz.question}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {quiz.options.map((opt, idx) => {
          let btnClass = "bg-cream-100 border border-brand-700/10 hover:bg-brand-500/5 text-brand-700/80";
          if (isAnswered) {
             if (idx === quiz.correct) {
               btnClass = "bg-brand-500/15 border-brand-500 text-brand-600 font-bold shadow-[0_0_15px_rgba(46,125,79,0.15)]";
             } else if (idx === selected) {
               btnClass = "bg-red-500/15 border-red-400 text-red-600 font-bold";
             } else {
               btnClass = "bg-cream-100 border-brand-700/5 text-brand-700/30 opacity-60";
             }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => setSelected(idx)}
              className={`p-4 rounded-2xl border transition-all duration-300 text-lg ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isAnswered && (
         <div className="flex justify-between items-center bg-cream-100 p-4 rounded-2xl border border-brand-700/10 animate-fade-in-up">
            <span className={`font-bold ${isCorrect ? 'text-brand-600' : 'text-red-600'}`}>
              {isCorrect ? 'Tahsin! To\'g\'ri javob.' : 'Xato qildingiz, qayta urinib ko\'ring.'}
            </span>
            {currentQ < letter.quiz.length - 1 && (
              <button
                onClick={handleNext}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-[0_0_10px_rgba(46,125,79,0.3)]"
              >
                Keyingi savol →
              </button>
            )}
         </div>
      )}
    </div>
  );
}
