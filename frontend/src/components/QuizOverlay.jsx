import React, { useState } from 'react';

const QuizOverlay = ({ quiz, onAnswer }) => {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    if (!quiz) return null;

    const handleOptionClick = (index, isCorrect) => {
        if (isAnswered) return;
        setSelectedIdx(index);
        setIsAnswered(true);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="bg-white text-gray-900 p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 leading-tight">{quiz.question}</h2>
                
                <div className="space-y-3">
                    {quiz.options.map((option, index) => {
                        let btnStyle = "border-gray-200 hover:border-indigo-500 hover:bg-indigo-50";
                        if (isAnswered) {
                            if (option.is_correct) btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-700";
                            else if (selectedIdx === index) btnStyle = "bg-rose-100 border-rose-500 text-rose-700";
                        }

                        return (
                            <button
                                key={index}
                                disabled={isAnswered}
                                onClick={() => handleOptionClick(index, option.is_correct)}
                                className={`w-full py-4 px-5 text-left border-2 rounded-2xl transition-all font-semibold ${btnStyle}`}
                            >
                                {option.text}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <button 
                        onClick={() => {
                            onAnswer(quiz.options[selectedIdx].is_correct);
                            setIsAnswered(false);
                            setSelectedIdx(null);
                        }}
                        className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                    >
                        {quiz.options[selectedIdx].is_correct ? "Correct! Continue →" : "Continue Anyway →"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizOverlay;