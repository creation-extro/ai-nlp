const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    videoId: { type: String, required: true },
    trigger_time_sec: { type: Number, required: true },
    question: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
            is_correct: { type: Boolean, required: true }
        }
    ]
}, { timestamps: true });

// The 'quizzes' at the end ensures it looks in the correct collection
module.exports = mongoose.model('Quiz', QuizSchema, 'quizzes');