// const { MongoClient } = require('mongodb');
// const { subMonths, startOfMonth, endOfMonth } = require('date-fns');

// // MongoDB connection settings
// const mongoURI =
//   'mongodb+srv://ankan_user:ankan_user@cluster0.qhihx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const dbName = 'stock_data_lastyear';
// const collectionName = 'monthly_data';

// // Function to fetch stock data for the last 12 months
// async function getStockData() {
//   const client = new MongoClient(mongoURI);

//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');

//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Define the date range (current month minus 12 months)
//     const endDate = new Date();
//     const startDate = startOfMonth(subMonths(endDate, 24)); // 12 months ago

//     // Get all stocks in the collection
//     const allStockData = await collection.find({}).toArray();

//     // Filter each stock's data to get only the last 12 months
//     const filteredStockData = allStockData.map((stock) => {
//       // Filter the result to keep only the data from the last 12 months
//       const recentData = stock.result.filter((entry) => {
//         const entryDate = new Date(entry.date);
//         return entryDate >= startDate && entryDate <= endDate;
//       });

//       return {
//         ticker: stock.ticker,
//         name :stock.name,
//         result: recentData,
//       };
//     });

//     return filteredStockData;

//   } catch (error) {
//     console.error('Error fetching stock data from MongoDB:', error.message);
//   } finally {
//     await client.close();
//   }
// }
// getStockData();
// // Export the getStockData function
// module.exports = { getStockData };



const { MongoClient } = require('mongodb');
const { subMonths, startOfMonth, endOfMonth } = require('date-fns');

// MongoDB connection settings
const mongoURI =
  'mongodb+srv://ankan_user:ankan_user@cluster0.qhihx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'stock_data_lastyear';
const collectionName = 'monthly_data';

// Function to fetch stock data for the last 12 months
async function getStockData() {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Define the date range (current month minus 12 months)
    const endDate = new Date();
    const startDate = startOfMonth(subMonths(endDate, 48)); // 24 months ago

    // Get all stocks in the collection
    const allStockData = await collection.find({}).toArray();

    // Filter each stock's data to get only the last 24 entries
    const filteredStockData = allStockData.map((stock) => {
      // Sort and limit to 24 entries, from most recent to oldest within the range
      const recentData = stock.result
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        })
        .slice(0, 48);  // Get only the most recent 24 entries

      return {
        ticker: stock.ticker,
        name: stock.name,
        result: recentData,
        industry:stock.industry,
        earningdate:stock.earningdate,
        marketCapInCr : stock.marketCapInCr,
      };
    });
    // console.log(filteredStockData);

    return filteredStockData;

  } catch (error) {
    console.error('Error fetching stock data from MongoDB:', error.message);
  } finally {
    await client.close();
  }
}

// getStockData();

// Export the getStockData function
module.exports = { getStockData };
