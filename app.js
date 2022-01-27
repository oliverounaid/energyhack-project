const today = new Date;
const y = today.getFullYear();
const m = today.getMonth();
const start = new Date().toISOString();
const end = new Date(Date.now() + (3600 * 1000 * 24)).toISOString();
let count = 0;

// const end = new Date(y, m + 1, 1).toISOString();
fetch(`https://dashboard.elering.ee/api/nps/price?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(res => {
        res.data.ee.forEach(el => {

            const date = new Date(el.timestamp * 1000);
            const options = { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const localDate = date.toLocaleString('et-EE', options);
            console.log(localDate, (el.price / 10).toFixed(2));
            count++;

        });
        console.log(count);

        const start2 = new Date(Date.now() - (3600 * 1000 * (24 - count))).toISOString();

        fetch(`https://dashboard.elering.ee/api/nps/price?start=${start2}&end=${start}`)
            .then(response => response.json())
            .then(res => {
                res.data.ee.forEach(el => {

                    const date = new Date(el.timestamp * 1000);
                    const options = { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                    const localDate = date.toLocaleString('et-EE', options);
                    console.log(localDate, (el.price / 10).toFixed(2));
                });
            });

    });
