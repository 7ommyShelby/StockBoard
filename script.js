
// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=YOUR_ALPHA_VANTAGE_API_KEY

const stockhunt = document.querySelector('.loadstk');
const searchstock = document.querySelector('.search');
const searchinput = document.querySelector('.searchinput');
const selectoptions = document.querySelector('.selectoptions');
const stockinfo = document.querySelector('.stockinfo');
const ctx = document.getElementById('myChart');
const table = document.querySelector('.table');

let symbol

const createOptions = () => {
    ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NFLX", "NVDA", "BRK.B", "JPM"].forEach((e) => {
        const option = document.createElement('option');
        option.textContent = e;
        option.value = e;
        selectoptions.appendChild(option);
    })

    selectoptions.addEventListener('change', (e) => {
        symbol = e.target.value;
    })
}

createOptions();


const loadstock = async (val) => {
    console.log(val);

    if (!val) {
        alert('Please select a stock');
        return;
    }

    const url = `https://alpha-vantage.p.rapidapi.com/query?datatype=json&output_size=compact&interval=5min&function=TIME_SERIES_DAILY&symbol=${val}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ef75754912msh197e010aa946b76p182927jsn3ffdd832791c',
            'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
        }
    };

    try {

        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        information(result);
        createGraph(result);
        createTable(result);

        // xaxis = Object.keys(result['Time Series (5min)']);

        // console.log(lastDate);

    } catch (error) {
        console.error(error);
    }

}

// result['Time Series (5min)'][xaxis.map((e) => {
//     return e.high;
// })];

console.log(stockinfo);

const information = (result) => {
    const lastDate = Object.keys(result['Time Series (Daily)'])[0];

    const diff = result['Time Series (Daily)'][lastDate]["4. close"] - result['Time Series (Daily)'][lastDate]["1. open"];

    const volume = result['Time Series (Daily)'][lastDate]["5. volume"];

    stockinfo.lastElementChild.innerHTML = `
    <p>Stock :${result['Meta Data']['2. Symbol']}</p>
    <p>Price :$${result['Time Series (Daily)'][lastDate]["4. close"]}</p>
    <p>Change :$${diff}</p>
    <p>Volume :${volume}</p>
    `
}

const createGraph = (result) => {
    const data = result['Time Series (Daily)']

    const convertedData = Object.keys(data).map((key) => {
        return {
            time: key,
            open: parseFloat(data[key]["1. open"]),
            high: parseFloat(data[key]["2. high"]),
            low: parseFloat(data[key]["3. low"]),
            close: parseFloat(data[key]["4. close"]),
            volume: Number(data[key]["5. volume"])
        }
    })

    console.log(data);

    const labels = convertedData.map((e) => {
        return e.time;
    })
    const ydata = convertedData.map((e) => {
        return e.high;
    })

    updateChart(labels, ydata)

}
let myChart;
function updateChart(labels, data) {

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timeline'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price'
                    }
                }
            }
        }
    });
}

const createTable = (result) => {

    const lastDate = Object.keys(result['Time Series (Daily)'])[0];

    const diff = result['Time Series (Daily)'][lastDate]["4. close"] - result['Time Series (Daily)'][lastDate]["1. open"];

    const volume = result['Time Series (Daily)'][lastDate]["5. volume"];

    table.innerHTML = `
    <thead>
        <tr>
            <th>Stock</th>
            <th>Price</th>
            <th>Change</th>
            <th>Volume</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>${result['Meta Data']['2. Symbol']}</td>
        <td>${result['Time Series (Daily)'][lastDate]["4. close"]}</td>
        <td>${diff}</td>
        <td>${volume}</td>
        </tr>
    </tbody>
    `
}



searchstock.addEventListener('click', () => {
    loadstock(searchinput.value);
});
stockhunt.addEventListener('click', () => {
    loadstock(symbol);
});