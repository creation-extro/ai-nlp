const express = require('express');
const router = express.Router();
const { getQuizzesByVideo } = require('../controllers/quizController');

// Endpoint: http://localhost:5000/api/quizzes/arrays_lecture_01
router.get('/:videoId', getQuizzesByVideo);

module.exports = router;