const today = new Date;
const y = today.getFullYear();
const m = today.getMonth();
const start = new Date().toISOString();
const end = new Date(Date.now() + (3600 * 1000 * 24)).toISOString();
let count = 0;
let dateHour = [];
let prices = [];
// const end = new Date(y, m + 1, 1).toISOString();
fetch(`https://dashboard.elering.ee/api/nps/price?start=${start}&end=${end}`)
  .then(response => response.json())
  .then(res => {
    res.data.ee.forEach(el => {
      const date = new Date(el.timestamp * 1000);
      const options = { hour: '2-digit' };
      const localDate = date.toLocaleString('et-EE', options);
      const secondData = [localDate, (el.price / 10).toFixed(2)];
      //console.log(secondData);
      dateHour.push(localDate);
      count++;
      //dateHour.push();
      prices.push((el.price / 10));
    });
    //console.log(count);
    if (prices.length < 24) {
      const start2 = new Date(Date.now() - (3600 * 1000 * (24 - count))).toISOString();
      const end2 = new Date().toISOString();
      fetch(`https://dashboard.elering.ee/api/nps/price?start=${start2}&end=${end2}`)
        .then(response => response.json())
        .then(res => {
          res.data.ee.forEach(el => {
            const date = new Date(el.timestamp * 1000);
            const options = { hour: '2-digit' };
            const localDate = date.toLocaleString('et-EE', options);
            const firstData = [localDate, (el.price / 10).toFixed(2)];
            dateHour.unshift(localDate);
            prices.unshift((el.price / 10));
          });
        });
    }
  });


console.log(dateHour);
console.log(prices);
// Chart.js
const labels = dateHour;
const data = {
  labels: labels,
  datasets: [{
    label: '',
    data: prices,
    backgroundColor: [
      'rgba(255, 99, 132, 0.1)'
     
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
};
const config = {
  type: 'bar',
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
};
const myChart = new Chart(
  document.getElementById('myChart'),
  config
);