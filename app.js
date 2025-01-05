const express = require('express');
const cors = require('cors');
const axios = require('axios');

const { getStockData } = require("./getStockData");

const { fetchData } = require('./fetchdata');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

// Function to run fetchData every 15 minutes
const runFetchData = () => {
    fetchData()
    setInterval(() => {
        fetchData();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
};

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/getdata', async (req, res) => {
    try {
        const data = await getStockData();

        let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stock Data</title>
        <style>
        body {
            background-color: black;
            color: white;
            font-family: Arial, sans-serif;
        }
        .row {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
        .result-name {
            flex: 1 0 6%;
            margin: 5px;
            text-align: center;
            padding: 10px;
            border-radius: 4px;
            font-weight: bold;
            min-height: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .pchange {
            font-size: 1.5em; /* Larger size for pchange */
        }
        .date {
            font-size: 0.8em; /* Smaller size for date */
            margin-top: 5px; /* Space between pchange and date */
        }
        .positive {
            background-color: green;
            color: white;
        }
        .negative {
            background-color: red;
            color: white;
        }
        .stock-header {
            font-weight: bold;
            padding-top: 20px;
            margin-bottom: 10px;
            border-top: 2px solid white;
        }
        </style>
    </head>
    <body>
        <div id="stocks-data">`;

        data.forEach((item, index) => {
            html += `
        <div class="stock-container">
            <div class="stock-header">
                ${index + 1}. Ticker: ${item.ticker} | Name: ${item.name}
            </div>`;

            if (item.result && Array.isArray(item.result)) {
                let rowHtml = '<div class="row">';

                item.result.forEach((subItem, subIndex) => {
                    const date = new Date(subItem.date);
                    const formattedDate = date.toLocaleString('en-US', { month: 'short', year: '2-digit' }); // Format to MMM-YY

                    let pchangeClass = subItem.pchange < 0 ? 'negative' : 'positive';
                    rowHtml += `
                    <div class="result-name ${pchangeClass}">
                        <div class="pchange">${subItem.pchange}</div>
                        <div class="date">${formattedDate}</div>
                    </div>`;

                    if ((subIndex + 1) % 12 === 0 || subIndex === item.result.length - 1) {
                        rowHtml += '</div>';
                        html += rowHtml;
                        rowHtml = '<div class="row">';
                    }
                });

                if (item.result.length < 12) {
                    rowHtml += '</div>';
                    html += rowHtml;
                }
            }

            html += `</div>`;
        });

        html += `
    </div>
</body>
</html>`;

        res.send(html);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).send('Internal Server Error');
    }
});






// Start sending messages and fetching data
function callAPI() {
    axios.get('https://seasonal-stock-analysis.onrender.com/')
        .then(response => {
            console.log('successfully rerender');
        })
        .catch(error => {
            console.error('Error occurred while calling API:');
        });
}
setInterval(callAPI, 10000);

runFetchData();

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
