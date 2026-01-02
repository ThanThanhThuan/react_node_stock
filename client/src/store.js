import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Thunks ---
export const fetchStockData = createAsyncThunk('stock/fetchStockData', async (symbol) => {
    const response = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
    return response.data;
});

export const fetchPortfolio = createAsyncThunk('portfolio/fetchPortfolio', async () => {
    const response = await axios.get('http://localhost:5000/api/portfolio');
    return response.data;
});

// --- Stock Slice ---
const stockSlice = createSlice({
    name: 'stock',
    initialState: { data: null, status: 'idle', sentiment: '' },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchStockData.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = 'succeeded';
            state.sentiment = action.payload.sentiment;
        });
    },
});

// --- Portfolio Slice ---
const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: { holdings: [] },
    extraReducers: (builder) => {
        builder.addCase(fetchPortfolio.fulfilled, (state, action) => {
            state.holdings = action.payload;
        });
    },
});

export const store = configureStore({
    reducer: {
        stock: stockSlice.reducer,
        portfolio: portfolioSlice.reducer,
    },
});