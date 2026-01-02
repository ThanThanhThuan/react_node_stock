require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Portfolio = require('./models/Portfolio');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// --- ROUTES ---

// 1. Get Stock Data (Time Series & Quote)
app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apiKey = process.env.ALPHA_VANTAGE_KEY;

    try {
        // Fetch Daily Data for Charts
        const historyRes = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);

        // Fetch Global Quote for Real-time Price
        const quoteRes = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);

        // Mock News Sentiment (Alpha Vantage news is separate, mocking for simplicity)
        const mockSentiment = Math.random() > 0.5 ? "Bullish" : "Bearish";

        res.json({
            history: historyRes.data['Time Series (Daily)'],
            quote: quoteRes.data['Global Quote'],
            sentiment: mockSentiment
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// 2. Portfolio: Add Position
app.post('/api/portfolio', async (req, res) => {
    try {
        const newItem = new Portfolio(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. Portfolio: Get All Positions
app.get('/api/portfolio', async (req, res) => {
    try {
        const items = await Portfolio.find();
        res.json(items);
    } catch (err) {
        res.status(500).json(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));