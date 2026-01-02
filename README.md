## Stock Market Insights Platform
📈 Stock Market Insights Platform
Project Overview

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to simulate stock market tracking and portfolio management. 
The application allows users to search for real-time stock data, visualize historical price movements via interactive candlestick charts, and manage a simulated portfolio with profit/loss calculations.

🛠 Tech Stack

Component	Technology	Purpose

Frontend	React (Vite)	fast, modern UI framework.

State Mgmt	Redux Toolkit	Global state for stock data & portfolio holdings.

UI/Charts	Bootstrap 5, Plotly.js	Responsive layout and financial data visualization.

Backend	Node.js, Express	API server to handle requests and hide API keys.

Database	MongoDB (Mongoose)	Persist portfolio positions (Symbol, Qty, Price).

External API	Alpha Vantage	Source for Real-time & Historical Stock Data.

🚀 Key Features

    Real-Time Stock Search

        Fetches live data (Global Quote) and historical data (Time Series Daily) from Alpha Vantage.

        Displays current price and a calculated "News Sentiment" (Mocked for demonstration).

    Interactive Visualization

        Renders a Candlestick Chart (Open, High, Low, Close) for the last 30 days using react-plotly.js.

        Allows zooming and panning on the chart.

    Portfolio Simulation

        Buy Simulation: Users can "buy" stocks by entering quantity and price.

        Persistence: Transactions are saved to a MongoDB database.

        P/L Analysis: Automatically calculates Profit/Loss based on the difference between the Average Buy Price and the Current Market Price.

⚡ Quick Start Command Recap

1. Backend
cd server
npm start

3. Frontend
cd client
npm run dev

<img width="1888" height="953" alt="image" src="https://github.com/user-attachments/assets/382728b8-3b9b-48d7-a5c8-7e33ccf2c0b4" />


  
