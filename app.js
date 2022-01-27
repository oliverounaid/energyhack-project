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

    console.log(dateHour);
    console.log(prices);

    // Chart.js
    const labels = dateHour;

    // teeb tühja array
    const barColors = []
    // for tsykkel, mis loeb 0-23ni
    for (let i = 0; i < 24; i++) {
      // paneb 24 korda sinna see punane v2rv
      barColors.push('rgb(255, 99, 132)')
    }

    const data = {
      labels: labels,
      datasets: [{
        label: 'Elektri hind [EUR/kWh]',
        backgroundColor: barColors,
        borderColor: 'rgb(255, 99, 132)',
        // paneb hinnad y teljele
        data: prices,
      }]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            title: {
              //color: 'red',
              display: true,
              text: 'Tunnid'
            }
          },
          y: {
            min: 0,
            title: {
              //color: 'red',
              display: true,
              text: 'Eurod'
            }
          }
        }
      }
    };

    const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );


    var dataset = myChart.data.datasets[0];
    for (var i = 0; i < dataset.data.length; i++) {
      // see for loop k2ib kogu data l2bi ja vaatab, et mis hind on
      // kui on alla 10.0, siis teeb roheliseks
      if (dataset.data[i] < 10.0) {
        dataset.backgroundColor[i] = 'rgb(0, 255, 132)';
      }
    }

    myChart.update();
  });
