let stockPrice = 100;
let cash = 100000;
let shares = 0;

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

// Simulate price changes
setInterval(() => {
  const change = (Math.random() * 4 - 2); // -2 to +2
  stockPrice = Math.max(1, stockPrice + change);
  updateDisplay();
}, 3000);

updateDisplay();
