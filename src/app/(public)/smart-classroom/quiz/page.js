// app/smart-classroom/quiz/page.js
"use client";
import { useState } from "react";

export default function QuizPage() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const sampleQuiz = {
    question: "ইসলামের প্রথম খলীফা হযরত আবু বকর (রা:) কত হিজরীতে খিলাফতের দায়িত্ব লাভ করেন?",
    options: ["১১ হিজরী", "১২ হিজরী", "১৩ হিজরী", "১০ হিজরী"],
    correctIndex: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="text-center mb-6">
          <span className="text-2xl">🏆</span>
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mt-1">আজকের কুইজ প্রতিযোগিতা</h3>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{sampleQuiz.question}</p>
        </div>

        <div className="space-y-2.5">
          {sampleQuiz.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(idx)}
              className={`w-full text-left text-xs sm:text-sm p-3.5 rounded-xl font-medium border transition-all ${
                selectedAnswer === idx
                  ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
                  : "bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100/70"
              }`}
            >
              {idx + 1}. {opt}
            </button>
          ))}
        </div>

        <button 
          disabled={selectedAnswer === null}
          className={`w-full font-bold text-xs sm:text-sm p-3.5 rounded-xl transition-all shadow-sm mt-6 ${
            selectedAnswer !== null 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" 
              : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          গোপন উত্তর সাবমিট করুন
        </button>
      </div>
    </div>
  );
}
