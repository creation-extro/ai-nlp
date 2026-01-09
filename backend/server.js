require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));