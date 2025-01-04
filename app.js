const express = require('express');
const cors = require('cors');
const axios = require('axios');

const { getStockData } = require("./getStockData");

const { fetchData } = require('./fetchdata');
const app = express();
const PORT = process.env.PORT || 4500;
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
            color: white; /* Ensure text is visible on the black background */
            font-family: Arial, sans-serif; /* Optional: to make the font more readable */
        }
        .row {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start; /* Align items to the left */
        }
        
        .result-name {
            flex: 1 0 6%; /* Adjusted to fit exactly 12 items in one row (100 / 12 = 8.33%) */
            margin: 5px;
            text-align: center;
            padding: 10px;
            border-radius: 4px;
            font-weight: bold;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
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
            border-top: 2px solid white; /* Added top border */

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
                let rowHtml = '<div class="row">'; // Start a new row

                item.result.forEach((subItem, subIndex) => {
                    // Determine class based on pchange value
                    let pchangeClass = subItem.pchange < 0 ? 'negative' : 'positive';
                    rowHtml += `<div class="result-name ${pchangeClass}">${subItem.pchange}</div>`;

                    // After every 12 items, close and start a new row
                    if ((subIndex + 1) % 12 === 0 || subIndex === item.result.length - 1) {
                        rowHtml += '</div>'; // End the current row
                        html += rowHtml; // Append row to HTML
                        rowHtml = '<div class="row">'; // Start a new row
                    }
                });

                // If there are less than 12 items, ensure that extra space is aligned to the left
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
