const Quiz = require('../models/Quiz');

// @desc    Get all quizzes for a specific video
exports.getQuizzesByVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        // We find by videoId and return the array
        const quizzes = await Quiz.find({ videoId: videoId });
        
        console.log(`API hit for videoId: ${videoId} | Items found: ${quizzes.length}`);
        res.status(200).json(quizzes); 
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};