
// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=YOUR_ALPHA_VANTAGE_API_KEY

const stockhunt = document.querySelector('.loadstk');
const searchstock = document.querySelector('.search');
const searchinput = document.querySelector('.searchinput');
const selectoptions = document.querySelector('.selectoptions');
const stockinfo = document.querySelector('.stockinfo');
const ctx = document.getElementById('myChart');

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

let xaxis

const loadstock = async () => {
    // console.log(symbol);

    if (!symbol) {
        alert('Please select a stock');
        return;
    }

    const url = `https://alpha-vantage.p.rapidapi.com/query?datatype=json&output_size=compact&interval=5min&function=TIME_SERIES_INTRADAY&symbol=${symbol}`;
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


        stockinfo.lastElementChild.innerHTML = `
        <p>${result['Meta Data']['1. Information']}</p>
        `
        // xaxis = Object.keys(result['Time Series (5min)']);

        // console.log(xaxis);

        const data = result['Time Series (5min)']

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

    } catch (error) {
        console.error(error);
    }

}

// result['Time Series (5min)'][xaxis.map((e) => {
//     return e.high;
// })];

console.log(stockinfo);

function updateChart(labels, data) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Volumes',
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







stockhunt.addEventListener('click', loadstock);