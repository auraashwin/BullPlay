const apiKey = 'ebf779398594498d8c45b400a305cd9a'; // Replace this with your real key
const cashElement = document.getElementById("cash");
const valueElement = document.getElementById("value");

let cash = 100000;
let stocks = [
  { symbol: "AAPL", name: "Apple", shares: 0, price: 0 },
  { symbol: "MSFT", name: "Microsoft", shares: 0, price: 0 },
  { symbol: "TSLA", name: "Tesla", shares: 0, price: 0 },
];

function updateDisplay() {
  cashElement.innerText = `₹${cash.toFixed(2)}`;

  let totalValue = cash;
  stocks.forEach((stock, i) => {
    const stockValue = stock.shares * stock.price;
    totalValue += stockValue;
    document.getElementById(`price-${i}`).innerText = isNaN(stock.price) ? "N/A" : `₹${stock.price.toFixed(2)}`;
    document.getElementById(`owned-${i}`).innerText = stock.shares;
  });

  valueElement.innerText = `₹${totalValue.toFixed(2)}`;
}

async function fetchPrices() {
  const symbols = stocks.map(s => s.symbol).join(",");
  try {
    const res = await fetch(`https://api.twelvedata.com/price?symbol=${symbols}&apikey=${apiKey}`);
    const data = await res.json();

    stocks.forEach((stock, i) => {
      if (data[stock.symbol] && data[stock.symbol].price) {
        stock.price = parseFloat(data[stock.symbol].price);
      }
    });

    updateDisplay();
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
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

// Load prices initially
fetchPrices();
// Update prices every 60 seconds to stay within rate limit
setInterval(fetchPrices, 60000);
