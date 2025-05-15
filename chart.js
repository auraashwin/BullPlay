const ctx = document.getElementById("stockChart").getContext("2d");
let stockChart;

document.getElementById("chart-stock").addEventListener("change", updateChart);

async function updateChart() {
  const symbol = document.getElementById("chart-stock").value;
  const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${apiKey}&outputsize=30`);
  const data = await res.json();

  if (!data || !data.values) {
    alert("Error loading chart data");
    return;
  }

  const labels = data.values.map(v => v.datetime).reverse();
  const prices = data.values.map(v => parseFloat(v.close)).reverse();

  if (stockChart) stockChart.destroy();

  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${symbol} Price`,
        data: prices,
        borderColor: 'blue',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}

// Initial load
updateChart();
