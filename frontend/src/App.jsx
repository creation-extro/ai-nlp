import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';
import QuizOverlay from './components/QuizOverlay';
import { fetchQuizzes } from './services/api';

function App() {
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [playerInstance, setPlayerInstance] = useState(null);
    
    // We use Refs for data the video player needs to check constantly
    const quizzesRef = useRef([]); 
    const triggeredTimesRef = useRef(new Set());

    const VIDEO_ID = "arrays_lecture_01"; 

    useEffect(() => {
        const loadQuizzes = async () => {
            const data = await fetchQuizzes(VIDEO_ID);
            console.log("✅ Data synced to Ref:", data);
            quizzesRef.current = data; // Store in ref so player can see it
        };
        loadQuizzes();
    }, []);

    const handleTimeUpdate = (currentTime, player) => {
        // Use the Ref to check for quizzes
        const quiz = quizzesRef.current.find(q => q.trigger_time_sec === currentTime);
        
        if (quiz && !triggeredTimesRef.current.has(currentTime)) {
            console.log("🎯 Triggering Quiz at:", currentTime);
            
            player.pause();
            setPlayerInstance(player);
            setActiveQuiz(quiz);
            
            // Mark as triggered in the Ref
            triggeredTimesRef.current.add(currentTime);
        }
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            setActiveQuiz(null);
            if (playerInstance) playerInstance.play();
        } else {
            alert("Oops! Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Skill-Guru AI
                </h1>
                <p className="text-slate-400 mt-2">Interactive Video Learning Platform</p>
            </header>

            <main className="relative w-full max-w-4xl px-4">
                <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-black">
                    <VideoPlayer src="/arrays.mp4" onTimeUpdate={handleTimeUpdate} />
                    <QuizOverlay quiz={activeQuiz} onAnswer={handleAnswer} />
                </div>
            </main>
        </div>
    );
}

export default App;