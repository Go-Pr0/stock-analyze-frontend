// Popular stock tickers with company names for suggestions
export const popularTickers = [
  // Tech Giants
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corporation' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { ticker: 'TSLA', name: 'Tesla Inc.' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'CRM', name: 'Salesforce Inc.' },
  { ticker: 'ORCL', name: 'Oracle Corporation' },
  
  // Financial Services
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'BAC', name: 'Bank of America Corp.' },
  { ticker: 'WFC', name: 'Wells Fargo & Company' },
  { ticker: 'GS', name: 'Goldman Sachs Group Inc.' },
  { ticker: 'MS', name: 'Morgan Stanley' },
  { ticker: 'V', name: 'Visa Inc.' },
  { ticker: 'MA', name: 'Mastercard Inc.' },
  { ticker: 'PYPL', name: 'PayPal Holdings Inc.' },
  
  // Healthcare & Pharma
  { ticker: 'JNJ', name: 'Johnson & Johnson' },
  { ticker: 'PFE', name: 'Pfizer Inc.' },
  { ticker: 'UNH', name: 'UnitedHealth Group Inc.' },
  { ticker: 'ABBV', name: 'AbbVie Inc.' },
  { ticker: 'MRK', name: 'Merck & Co. Inc.' },
  { ticker: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
  
  // Consumer & Retail
  { ticker: 'WMT', name: 'Walmart Inc.' },
  { ticker: 'HD', name: 'Home Depot Inc.' },
  { ticker: 'PG', name: 'Procter & Gamble Co.' },
  { ticker: 'KO', name: 'Coca-Cola Company' },
  { ticker: 'PEP', name: 'PepsiCo Inc.' },
  { ticker: 'NKE', name: 'Nike Inc.' },
  { ticker: 'COST', name: 'Costco Wholesale Corp.' },
  { ticker: 'SBUX', name: 'Starbucks Corporation' },
  
  // Industrial & Energy
  { ticker: 'XOM', name: 'Exxon Mobil Corporation' },
  { ticker: 'CVX', name: 'Chevron Corporation' },
  { ticker: 'BA', name: 'Boeing Company' },
  { ticker: 'CAT', name: 'Caterpillar Inc.' },
  { ticker: 'GE', name: 'General Electric Company' },
  { ticker: 'MMM', name: '3M Company' },
  
  // Telecommunications
  { ticker: 'VZ', name: 'Verizon Communications Inc.' },
  { ticker: 'T', name: 'AT&T Inc.' },
  { ticker: 'TMUS', name: 'T-Mobile US Inc.' },
  
  // ETFs
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust' },
  { ticker: 'IWM', name: 'iShares Russell 2000 ETF' },
  { ticker: 'VTI', name: 'Vanguard Total Stock Market ETF' },
  
  // Crypto-related
  { ticker: 'COIN', name: 'Coinbase Global Inc.' },
  { ticker: 'MSTR', name: 'MicroStrategy Inc.' },
  
  // Emerging Tech
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.' },
  { ticker: 'SNOW', name: 'Snowflake Inc.' },
  { ticker: 'ZM', name: 'Zoom Video Communications Inc.' },
  { ticker: 'ROKU', name: 'Roku Inc.' },
  { ticker: 'SQ', name: 'Block Inc.' },
  { ticker: 'SHOP', name: 'Shopify Inc.' },
];

export const searchTickers = (query) => {
  if (!query || query.length < 1) return [];
  
  const searchTerm = query.toLowerCase();
  
  return popularTickers
    .filter(item => 
      item.ticker.toLowerCase().includes(searchTerm) || 
      item.name.toLowerCase().includes(searchTerm)
    )
    .slice(0, 8); // Limit to 8 suggestions
};