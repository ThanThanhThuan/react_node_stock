import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockData, fetchPortfolio } from './store';
import Plot from 'react-plotly.js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [symbol, setSymbol] = useState('IBM'); // Default for free API
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);

  const dispatch = useDispatch();
  const { data, sentiment } = useSelector((state) => state.stock);
  const { holdings } = useSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchStockData(symbol));
  };

  const addToPortfolio = async () => {
    await axios.post('http://localhost:5000/api/portfolio', {
      symbol: symbol,
      quantity: Number(qty),
      avgBuyPrice: Number(price)
    });
    dispatch(fetchPortfolio());
  };

  // Process Chart Data
  let xValues = [];
  let openValues = [];
  let highValues = [];
  let lowValues = [];
  let closeValues = [];

  if (data && data.history) {
    const dates = Object.keys(data.history).slice(0, 30); // Last 30 days
    xValues = dates;
    openValues = dates.map(d => data.history[d]['1. open']);
    highValues = dates.map(d => data.history[d]['2. high']);
    lowValues = dates.map(d => data.history[d]['3. low']);
    closeValues = dates.map(d => data.history[d]['4. close']);
  }

  const currentPrice = data?.quote ? Number(data.quote['05. price']) : 0;

  return (
    <div className="container-fluid bg-dark text-white min-vh-100 p-4">
      <h1 className="mb-4">📈 THAN Stock Insights Platform</h1>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-4 d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter Symbol (e.g. IBM)"
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div className="row">
        {/* Left Column: Charts & Info */}
        <div className="col-md-8">
          {data ? (
            <div className="card bg-secondary text-white mb-4">
              <div className="card-body">
                <h3>{symbol.toUpperCase()} - ${currentPrice}</h3>
                <p className={`badge ${sentiment === 'Bullish' ? 'bg-success' : 'bg-danger'}`}>
                  News Sentiment: {sentiment}
                </p>

                <Plot
                  data={[
                    {
                      x: xValues,
                      close: closeValues,
                      decreasing: { line: { color: 'red' } },
                      high: highValues,
                      increasing: { line: { color: 'green' } },
                      line: { color: 'rgba(31,119,180,1)' },
                      low: lowValues,
                      open: openValues,
                      type: 'candlestick',
                      xaxis: 'x',
                      yaxis: 'y'
                    }
                  ]}
                  layout={{
                    width: '100%',
                    height: 400,
                    title: `${symbol} Price History`,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: "white" }
                  }}
                  useResizeHandler={true}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          ) : <p>Search for a stock to see data...</p>}
        </div>

        {/* Right Column: Portfolio Simulation */}
        <div className="col-md-4">
          <div className="card bg-secondary text-white">
            <div className="card-header">Portfolio Simulation</div>
            <div className="card-body">
              <h5>Add Position</h5>
              <div className="mb-2">
                <input type="number" placeholder="Qty" className="form-control mb-2" onChange={e => setQty(e.target.value)} />
                <input type="number" placeholder="Buy Price" className="form-control mb-2" onChange={e => setPrice(e.target.value)} />
                <button className="btn btn-success w-100" onClick={addToPortfolio}>Buy Stock</button>
              </div>

              <hr />

              <h5>Current Holdings</h5>
              <div className="table-responsive">
                <table className="table table-dark table-sm">
                  <thead>
                    <tr>
                      <th>Sym</th>
                      <th>Qty</th>
                      <th>Avg</th>
                      <th>P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h) => {
                      // Simple P/L Logic: (Current Price - Avg Buy) * Qty
                      // Note: In a real app, you'd match the holding symbol to current fetched price
                      const isCurrentSymbol = h.symbol.toUpperCase() === symbol.toUpperCase();
                      const livePrice = isCurrentSymbol ? currentPrice : h.avgBuyPrice;
                      const pl = ((livePrice - h.avgBuyPrice) * h.quantity).toFixed(2);

                      return (
                        <tr key={h._id}>
                          <td>{h.symbol}</td>
                          <td>{h.quantity}</td>
                          <td>${h.avgBuyPrice}</td>
                          <td className={pl >= 0 ? 'text-success' : 'text-danger'}>
                            {pl}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;