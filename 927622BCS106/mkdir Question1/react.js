import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Button, Select, MenuItem } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { HeatMap, HeatMapTooltip } from 'react-heat-map';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '      
    },
  },
});

function App() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [timeInterval, setTimeInterval] = useState('1m');
  const [correlationData, setCorrelationData] = useState({});

  useEffect(() => {
    fetch('https://api.example.com/stocks')
      .then(response => response.json())
      .then(data => setStocks(data));
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetch(`https://api.example.com/stock/${selectedStock}/prices?interval=${timeInterval}`)
        .then(response => response.json())
        .then(data => {
          const prices = data.prices.map(price => ({ date: price.date, value: price.value }));
          setCorrelationData({ prices, average: data.average, stdDev: data.stdDev });
        });
    }
  }, [selectedStock, timeInterval]);

  const handleStockChange = event => {
    setSelectedStock(event.target.value);
  };

  const handleTimeIntervalChange = event => {
    setTimeInterval(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Typography variant="h4">Stock Price Aggregation</Typography>
            <Select value={selectedStock} onChange={handleStockChange}>
              {stocks.map(stock => (
                <MenuItem key={stock.symbol} value={stock.symbol}>
                  {stock.name}
                </MenuItem>
              ))}
            </Select>
            <Select value={timeInterval} onChange={handleTimeIntervalChange}>
              <MenuItem value="1m">1 minute</MenuItem>
              <MenuItem value="5m">5 minutes</MenuItem>
              <MenuItem value="1h">1 hour</MenuItem>
            </Select>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <LineChart width={800} height={400} data={correlationData.prices}>
              <Line type="monotone" dataKey="value" stroke="           
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <Legend />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <HeatMap
              data={correlationData.correlation}
              width={800}
              height={400}
              cellSize={20}
              cellRender={(x, y) => (
                <HeatMapTooltip
                  x={x}
                  y={y}
                  value={correlationData.correlation[x][y]}
                />
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;