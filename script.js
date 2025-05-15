const apiKey = "2504ec80842a4443a2a7e4c1ed324842"; // Replace with Twelve Data API key
let cash = 100000;
let stocks = [
  { symbol: "AAPL", name: "Apple", shares: 0, price: 0 },
  { symbol: "MSFT", name: "Microsoft", shares: 0, price: 0 },
  { symbol: "TSLA", name: "Tesla", shares: 0, price: 0 },
];

function renderStocks() {
  const stockDiv = document.getElementById("stocks");
  stockDiv.innerHTML = "";
  stocks.forEach((stock, i) => {
    stockDiv.innerHTML += `
      <div class="stock">
        <h3>${stock.symbol} (${stock.name})</h3>
        <p>Price: ₹<span id="price-${i}">NaN</span></p>
        <p>Shares Owned: <span id="owned-${i}">0</span></p>
        <input id="qty-${i}" type="number" placeholder="Qty"/>
        <button onclick="buyStock(${i})">Buy</button>
        <button onclick="sellStock(${i})">Sell</button>
      </div>
    `;
  });
}

function updateDisplay() {
  document.getElementById("cash").innerText = `₹${cash.toFixed(2)}`;
  let totalValue = cash;
  stocks.forEach((stock, i) => {
    document.getElementById(`price-${i}`).innerText = isNaN(stock.price) ? "N/A" : stock.price.toFixed(2);
    document.getElementById(`owned-${i}`).innerText = stock.shares;
    totalValue += stock.shares * stock.price;
  });
  document.getElementById("value").innerText = `₹${totalValue.toFixed(2)}`;
}

async function fetchPrices() {
  const symbols = stocks.map(s => s.symbol).join(",");
  const res = await fetch(`https://api.twelvedata.com/price?symbol=${symbols}&apikey=${apiKey}`);
  const data = await res.json();
  stocks.forEach(stock => {
    if (data[stock.symbol] && data[stock.symbol].price) {
      stock.price = parseFloat(data[stock.symbol].price);
    }
  });
  updateDisplay();
}

function buyStock(i) {
  const qty = parseInt(document.getElementById(`qty-${i}`).value);
  if (!qty || qty <= 0) return;
  const cost = qty * stocks[i].price;
  if (cash >= cost) {
    cash -= cost;
    stocks[i].shares += qty;
    updateDisplay();
  } else {
    alert("Not enough cash.");
  }
}

function sellStock(i) {
  const qty = parseInt(document.getElementById(`qty-${i}`).value);
  if (!qty || qty <= 0) return;
  if (stocks[i].shares >= qty) {
    cash += qty * stocks[i].price;
    stocks[i].shares -= qty;
    updateDisplay();
  } else {
    alert("Not enough shares.");
  }
}

// Initial render
renderStocks();
fetchPrices();
setInterval(fetchPrices, 60000); // every 60 seconds
