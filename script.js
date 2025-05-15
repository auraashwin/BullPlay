const apiKey = 'ebf779398594498d8c45b400a305cd9a'; // Replace this with your real key
const symbol = 'AAPL'; // You can change this to TSLA, MSFT, etc.
let stockPrice = 0;
let cash = 100000;
let shares = 0;

async function fetchPrice() {
  try {
    const response = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
    const data = await response.json();
    stockPrice = parseFloat(data.price);
    updateDisplay();
  } catch (err) {
    console.error("Error fetching stock price:", err);
  }
}

function updateDisplay() {
  document.getElementById("stockPrice").textContent = stockPrice.toFixed(2);
  document.getElementById("cash").textContent = cash.toFixed(2);
  document.getElementById("shares").textContent = shares;
  const totalValue = cash + (shares * stockPrice);
  document.getElementById("totalValue").textContent = totalValue.toFixed(2);
}

function buyStock() {
  const qty = parseInt(document.getElementById("quantity").value);
  if (qty > 0 && cash >= qty * stockPrice) {
    shares += qty;
    cash -= qty * stockPrice;
    updateDisplay();
  } else {
    alert("Not enough cash!");
  }
}

function sellStock() {
  const qty = parseInt(document.getElementById("quantity").value);
  if (qty > 0 && shares >= qty) {
    shares -= qty;
    cash += qty * stockPrice;
    updateDisplay();
  } else {
    alert("Not enough shares!");
  }
}

// Fetch real-time price every 15 seconds
setInterval(fetchPrice, 15000);

// Initial fetch
fetchPrice();
