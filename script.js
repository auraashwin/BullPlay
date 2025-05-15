const apiKey = 'ebf779398594498d8c45b400a305cd9a'; // Replace this with your real key
let cash = 100000;

const stocks = [
  { symbol: 'AAPL', price: 0, shares: 0 },
  { symbol: 'MSFT', price: 0, shares: 0 },
  { symbol: 'TSLA', price: 0, shares: 0 }
];

async function fetchPrices() {
  for (let stock of stocks) {
    try {
      const res = await fetch(`https://api.twelvedata.com/price?symbol=${stock.symbol}&apikey=${apiKey}`);
      const data = await res.json();
      stock.price = parseFloat(data.price);
    } catch {
      stock.price = 0;
    }
  }
  updateUI();
}

function updateUI() {
  const container = document.getElementById('stocksContainer');
  container.innerHTML = '';

  let totalValue = cash;

  for (let stock of stocks) {
    totalValue += stock.shares * stock.price;

    const card = document.createElement('div');
    card.className = 'stock-card';

    card.innerHTML = `
      <h3>${stock.symbol}</h3>
      <p>Price: ₹${stock.price.toFixed(2)}</p>
      <p>Shares Owned: ${stock.shares}</p>
      <input type="number" id="qty-${stock.symbol}" min="1" placeholder="Qty" />
      <button onclick="buyStock('${stock.symbol}')">Buy</button>
      <button onclick="sellStock('${stock.symbol}')">Sell</button>
    `;

    container.appendChild(card);
  }

  document.getElementById('cash').textContent = cash.toFixed(2);
  document.getElementById('totalValue').textContent = totalValue.toFixed(2);
}

function buyStock(symbol) {
  const stock = stocks.find(s => s.symbol === symbol);
  const qty = parseInt(document.getElementById(`qty-${symbol}`).value);

  if (!qty || qty <= 0) return;

  const cost = qty * stock.price;
  if (cash >= cost) {
    cash -= cost;
    stock.shares += qty;
    updateUI();
  } else {
    alert("Not enough cash!");
  }
}

function sellStock(symbol) {
  const stock = stocks.find(s => s.symbol === symbol);
  const qty = parseInt(document.getElementById(`qty-${symbol}`).value);

  if (!qty || qty <= 0) return;

  if (stock.shares >= qty) {
    stock.shares -= qty;
    cash += qty * stock.price;
    updateUI();
  } else {
    alert("Not enough shares!");
  }
}

setInterval(fetchPrices, 15000); // refresh every 15 seconds
fetchPrices();

