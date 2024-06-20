
function destroyChart() {
  chart.destroy();
}

function renderChart(id) {
  ctx = document.getElementById(`myChart`);
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartNames,
      datasets: [
        {
          label: '',
          data: chartStats,
          borderWidth: 1,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)'
          ],
        },
      ],
    },
    options: {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
    },
  });
}

