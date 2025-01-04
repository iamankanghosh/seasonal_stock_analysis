const yahooFinance = require('yahoo-finance2').default;
const { format, subMonths, startOfMonth } = require('date-fns');
const { MongoClient } = require('mongodb');

// MongoDB connection settings
const mongoURI = 'mongodb+srv://ankan_user:ankan_user@cluster0.qhihx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'stock_data_lastyear';
const collectionName = 'monthly_data';

// Function to fetch and aggregate monthly stock data
async function getMonthlyDataForTickers(tickerList) {
  const endDate = new Date();
  const startDate = startOfMonth(subMonths(endDate, 38));

  const results = [];

  for (const ticker of tickerList) {
    try {
      const stockInfo = await yahooFinance.quote(ticker);
      const stockName = stockInfo.longName || stockInfo.shortName || 'Unknown';

      const data = await yahooFinance.historical(ticker, {
        period1: startDate.toISOString(),
        period2: endDate.toISOString(),
        interval: '1d',
      });
      if (!data || data.length === 0) {
        console.error(`No data found for ticker ${ticker} from Yahoo Finance.`);
        continue; // Skip this ticker and move to the next one
      }


      // Aggregate daily data into monthly and prepare result object
      const monthlyData = aggregateMonthly(data, ticker);
      results.push({
        ticker: ticker,
        name: stockName,
        result: monthlyData,
      });
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error.message);
    }
  }

  return results;
}

// Helper function to aggregate daily data into monthly data
function aggregateMonthly(data, ticker) {
  const monthlyData = {};
  data.forEach((item) => {
    const date = new Date(item.date);
    const monthKey = format(date, 'yyyy-MM'); // Format month key, e.g., "2024-12"
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { ...item, ticker }; // Initialize with first day of the month
    } else {
      monthlyData[monthKey] = { ...item, ticker }; // Update with the last day of the month
    }
  });

  // Prepare data array
  const monthlyArray = Object.values(monthlyData).map((entry) => ({
    date: format(new Date(entry.date), 'yyyy-MM-dd'), // Format date as "yyyy-MM-dd"
    ticker: entry.ticker,
    close: entry.close,
    open: entry.open,
    high: entry.high,
    low: entry.low,
    volume: entry.volume,
  }));

  // Calculate percentage change
  for (let i = 1; i < monthlyArray.length; i++) {
    const current = monthlyArray[i];
    const previous = monthlyArray[i - 1];
    const pchange = ((current.close - previous.close) / previous.close) * 100;

    // Round to 2 decimal places
    current.pchange = parseFloat(pchange.toFixed(2));
  }

  // Ensure first month's pchange is null (no prior data to compare)
  if (monthlyArray.length > 0) {
    monthlyArray[0].pchange = null;
  }

  // Sort data by date in descending order (latest month first)
  return monthlyArray.sort((a, b) => new Date(b.date) - new Date(a.date));
}


// Function to save data to MongoDB
async function saveDataToMongoDB(data) {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    // console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    for (const stockData of data) {
      try {
        // Upsert document (insert if doesn't exist, update if exists)
        await collection.updateOne(
          { ticker: stockData.ticker },
          {
            $set: {
              name: stockData.name, result: stockData.result,
            }
          },
          { upsert: true }
        );
        // console.log(`Data for ticker ${stockData.ticker} saved/updated successfully.`);
      } catch (error) {
        console.error(`Error saving data for ticker ${stockData.ticker}:`, error.message);
      }
    }

    console.log(`${data.length} stocks' data saved/updated in MongoDB`);
  } catch (error) {
    console.error('Error saving data to MongoDB:', error.message);
  } finally {
    await client.close();
  }
}

// Main execution
async function fetchData() {
  console.log("fetchdata called");
  // const tickers = ['SBIN.NS','^NSEI',  'TCS.NS', 'INFY.NS','INDHOTEL.NS']; // List of ticker symbols
  const tickers = [
    '^NSEI',         // NIFTY 50
    '^NSEBANK',      // NIFTY Bank ------------------------------------------------------------------------
    '^CNXFIN',       // NIFTY Financial Services ------------------------------------------------------------------------
    '^CNXAUTO',      // NIFTY Auto ------------------------------------------------------------------------
    '^CNXFMCG',      // NIFTY FMCG ------------------------------------------------------------------------
    '^CNXIT',        // NIFTY IT ------------------------------------------------------------------------
    '^CNXPHARMA',    // NIFTY Pharma ------------------------------------------------------------------------
    '^CNXMETAL',     // NIFTY Metal ------------------------------------------------------------------------
    '^CNXREALTY',    // NIFTY Realty ------------------------------------------------------------------------
    '^CNXENERGY',    // NIFTY Energy ------------------------------------------------------------------------
    '^CNXINFRA',     // NIFTY Infrastructure ------------------------------------------------------------------------
    '^CNXCMDT',    // NIFTY Commodities ------------------------------------------------------------------------
    '^CNXMEDIA',     // NIFTY Media ------------------------------------------------------------------------
    '^CNXPSUBANK',   // NIFTY PSU Bank ------------------------------------------------------------------------

    "M&M.NS", //Automobile and Auto Components
    "MARUTI.NS", //Automobile and Auto Components
    "TATAMTRDVR.NS", //Automobile and Auto Components
    "TATAMOTORS.NS", //Automobile and Auto Components
    "BAJAJ-AUTO.NS", //Automobile and Auto Components
    "EICHERMOT.NS", //Automobile and Auto Components
    "TVSMOTOR.NS", //Automobile and Auto Components
    "MOTHERSON.NS", //Automobile and Auto Components
    "BOSCHLTD.NS", //Automobile and Auto Components
    "HEROMOTOCO.NS", //Automobile and Auto Components
    "TIINDIA.NS", //Automobile and Auto Components
    "UNOMINDA.NS", //Automobile and Auto Components
    "BALKRISIND.NS", //Automobile and Auto Components
    "SCHAEFFLER.NS", //Automobile and Auto Components
    "MRF.NS", //Automobile and Auto Components
    "SONACOMS.NS", //Automobile and Auto Components
    "EXIDEIND.NS", //Automobile and Auto Components
    "APOLLOTYRE.NS", //Automobile and Auto Components
    "ENDURANCE.NS", //Automobile and Auto Components
    "MSUMI.NS", //Automobile and Auto Components
    "SUNDRMFAST.NS", //Automobile and Auto Components
    "ZFCVINDIA.NS", //Automobile and Auto Components
    "JBMA.NS", //Automobile and Auto Components
    "CIEINDIA.NS", //Automobile and Auto Components
    "ASAHIINDIA.NS", //Automobile and Auto Components
    "CEATLTD.NS", //Automobile and Auto Components
    "CRAFTSMAN.NS", //Automobile and Auto Components
    "OLECTRA.NS", //Automobile and Auto Components
    "VARROC.NS", //Automobile and Auto Components
    "SUPRAJIT.NS", //Automobile and Auto Components
    "JAMNAAUTO.NS", //Automobile and Auto Components
    "HAL.NS", //Capital Goods
    "SIEMENS.NS", //Capital Goods
    "BEL.NS", //Capital Goods
    "ABB.NS", //Capital Goods
    "CGPOWER.NS", //Capital Goods
    "POLYCAB.NS", //Capital Goods
    "MAZDOCK.NS", //Capital Goods
    "CUMMINSIND.NS", //Capital Goods
    "SUZLON.NS", //Capital Goods
    "BHEL.NS", //Capital Goods
    "ASHOKLEY.NS", //Capital Goods
    "POWERINDIA.NS", //Capital Goods
    "BHARATFORG.NS", //Capital Goods
    "SUPREMEIND.NS", //Capital Goods
    "THERMAX.NS", //Capital Goods
    "APLAPOLLO.NS", //Capital Goods
    "APARINDS.NS", //Capital Goods
    "ASTRAL.NS", //Capital Goods
    "COCHINSHIP.NS", //Capital Goods
    "BDL.NS", //Capital Goods
    "KEI.NS", //Capital Goods
    "HONAUT.NS", //Capital Goods
    "ESCORTS.NS", //Capital Goods
    "KEC.NS", //Capital Goods
    "AIAENG.NS", //Capital Goods
    "CARBORUNIV.NS", //Capital Goods
    "TRITURBINE.NS", //Capital Goods
    "TIMKEN.NS", //Capital Goods
    "RATNAMANI.NS", //Capital Goods
    "SKFINDIA.NS", //Capital Goods
    "GRINDWELL.NS", //Capital Goods
    "WELCORP.NS", //Capital Goods
    "ELGIEQUIP.NS", //Capital Goods
    "FINCABLES.NS", //Capital Goods
    "BEML.NS", //Capital Goods
    "FINPIPE.NS", //Capital Goods
    "PRAJIND.NS", //Capital Goods
    "DATAPATTNS.NS", //Capital Goods
    "KSB.NS", //Capital Goods
    "INGERRAND.NS", //Capital Goods
    "GRAPHITE.NS", //Capital Goods
    "RHIM.NS", //Capital Goods
    "HEG.NS", //Capital Goods
    "EPL.NS", //Capital Goods
    "BORORENEW.NS", //Capital Goods
    "GMMPFAUDLR.NS", //Capital Goods
    "MTARTECH.NS", //Capital Goods
    "PRINCEPIPE.NS", //Capital Goods
    "POLYPLEX.NS", //Capital Goods
    "UFLEX.NS", //Capital Goods
    "HLEGLAS.NS", //Capital Goods
    "PIDILITIND.NS", //Chemicals
    "SOLARINDS.NS", //Chemicals
    "SRF.NS", //Chemicals
    "FACT.NS", //Chemicals
    "COROMANDEL.NS", //Chemicals
    "PIIND.NS", //Chemicals
    "LINDEINDIA.NS", //Chemicals
    "UPL.NS", //Chemicals
    "FLUOROCHEM.NS", //Chemicals
    "DEEPAKNTR.NS", //Chemicals
    "SUMICHEM.NS", //Chemicals
    "TATACHEM.NS", //Chemicals
    "BAYERCROP.NS", //Chemicals
    "BASF.NS", //Chemicals
    "ATUL.NS", //Chemicals
    "CHAMBLFERT.NS", //Chemicals
    "VINATIORGA.NS", //Chemicals
    "PCBL.NS", //Chemicals
    "NAVINFLUOR.NS", //Chemicals
    "EIDPARRY.NS", //Chemicals
    "CLEAN.NS", //Chemicals
    "AARTIIND.NS", //Chemicals
    "DEEPAKFERT.NS", //Chemicals
    "FINEORG.NS", //Chemicals
    "JUBLINGREA.NS", //Chemicals
    "AETHER.NS", //Chemicals
    "RCF.NS", //Chemicals
    "ALKYLAMINE.NS", //Chemicals
    "GALAXYSURF.NS", //Chemicals
    "GNFC.NS", //Chemicals
    "GSFC.NS", //Chemicals
    "ACI.NS", //Chemicals
    "ANURAS.NS", //Chemicals
    "CHEMPLASTS.NS", //Chemicals
    "EPIGRAL.NS", //Chemicals
    "SHARDACROP.NS", //Chemicals
    "LXCHEM.NS", //Chemicals
    "RAIN.NS", //Chemicals
    "RALLIS.NS", //Chemicals
    "BALAMINES.NS", //Chemicals
    "GUJALKALI.NS", //Chemicals
    "ROSSARI.NS", //Chemicals
    "NOCIL.NS", //Chemicals
    "LT.NS", //Construction
    "RVNL.NS", //Construction
    "IRB.NS", //Construction
    "NBCC.NS", //Construction
    "KPIL.NS", //Construction
    "NCC.NS", //Construction
    "RITES.NS", //Construction
    "GRINFRA.NS", //Construction
    "SWSOLAR.NS", //Construction
    "ENGINERSIN.NS", //Construction
    "KNRCON.NS", //Construction
    "PNCINFRA.NS", //Construction
    "ULTRACEMCO.NS", //Construction Materials
    "GRASIM.NS", //Construction Materials
    "AMBUJACEM.NS", //Construction Materials
    "SHREECEM.NS", //Construction Materials
    "ACC.NS", //Construction Materials
    "JKCEMENT.NS", //Construction Materials
    "DALBHARAT.NS", //Construction Materials
    "RAMCOCEM.NS", //Construction Materials
    "NUVOCO.NS", //Construction Materials
    "INDIACEM.NS", //Construction Materials
    "JKLAKSHMI.NS", //Construction Materials
    "BIRLACORPN.NS", //Construction Materials
    "PRSMJOHNSN.NS", //Construction Materials
    "TITAN.NS", //Consumer Durables
    "ASIANPAINT.NS", //Consumer Durables
    "DIXON.NS", //Consumer Durables
    "HAVELLS.NS", //Consumer Durables
    "KALYANKJIL.NS", //Consumer Durables
    "VOLTAS.NS", //Consumer Durables
    "BERGEPAINT.NS", //Consumer Durables
    "BLUESTARCO.NS", //Consumer Durables
    "METROBRAND.NS", //Consumer Durables
    "AMBER.NS", //Consumer Durables
    "CROMPTON.NS", //Consumer Durables
    "WHIRLPOOL.NS", //Consumer Durables
    "KANSAINER.NS", //Consumer Durables
    "CENTURYPLY.NS", //Consumer Durables
    "BATAINDIA.NS", //Consumer Durables
    "VGUARD.NS", //Consumer Durables
    "KAJARIACER.NS", //Consumer Durables
    "RELAXO.NS", //Consumer Durables
    "TTKPRESTIG.NS", //Consumer Durables
    "CERA.NS", //Consumer Durables
    "CAMPUS.NS", //Consumer Durables
    "IFBIND.NS", //Consumer Durables
    "VIPIND.NS", //Consumer Durables
    "RAJESHEXPO.NS", //Consumer Durables
    "INDIGOPNTS.NS", //Consumer Durables
    "ORIENTELEC.NS", //Consumer Durables
    "VAIBHAVGBL.NS", //Consumer Durables
    "GREENPANEL.NS", //Consumer Durables
    "DMART.NS", //Consumer Services
    "TRENT.NS", //Consumer Services
    "ZOMATO.NS", //Consumer Services
    "INDHOTEL.NS", //Consumer Services
    "NAUKRI.NS", //Consumer Services
    "IRCTC.NS", //Consumer Services
    "JUBLFOOD.NS", //Consumer Services
    "NYKAA.NS", //Consumer Services
    "MANYAVAR.NS", //Consumer Services
    "ABFRL.NS", //Consumer Services
    "EIHOTEL.NS", //Consumer Services
    "DEVYANI.NS", //Consumer Services
    "CHALET.NS", //Consumer Services
    "BLS.NS", //Consumer Services
    "INDIAMART.NS", //Consumer Services
    "LEMONTREE.NS", //Consumer Services
    "WESTLIFE.NS", //Consumer Services
    "SAPPHIRE.NS", //Consumer Services
    "MEDPLUS.NS", //Consumer Services
    "JUSTDIAL.NS", //Consumer Services
    "MHRIL.NS", //Consumer Services
    "VMART.NS", //Consumer Services
    "SHOPERSTOP.NS", //Consumer Services
    "GOCOLORS.NS", //Consumer Services
    "RBA.NS", //Consumer Services
    "DELTACORP.NS", //Consumer Services
    "EASEMYTRIP.NS", //Consumer Services
    "GODREJIND.NS", //Diversified
    "3MINDIA.NS", //Diversified
    "DCMSHRIRAM.NS", //Diversified
    "ITC.NS", //Fast Moving Consumer Goods
    "HINDUNILVR.NS", //Fast Moving Consumer Goods
    "VBL.NS", //Fast Moving Consumer Goods
    "NESTLEIND.NS", //Fast Moving Consumer Goods
    "BRITANNIA.NS", //Fast Moving Consumer Goods
    "GODREJCP.NS", //Fast Moving Consumer Goods
    "DABUR.NS", //Fast Moving Consumer Goods
    "TATACONSUM.NS", //Fast Moving Consumer Goods
    "MARICO.NS", //Fast Moving Consumer Goods
    "COLPAL.NS", //Fast Moving Consumer Goods
    "PATANJALI.NS", //Fast Moving Consumer Goods
    "UBL.NS", //Fast Moving Consumer Goods
    "PGHH.NS", //Fast Moving Consumer Goods
    "AWL.NS", //Fast Moving Consumer Goods
    "RADICO.NS", //Fast Moving Consumer Goods
    "EMAMILTD.NS", //Fast Moving Consumer Goods
    "GODFRYPHLP.NS", //Fast Moving Consumer Goods
    "BIKAJI.NS", //Fast Moving Consumer Goods
    "BBTC.NS", //Fast Moving Consumer Goods
    "JYOTHYLAB.NS", //Fast Moving Consumer Goods
    "GODREJAGRO.NS", //Fast Moving Consumer Goods
    "ZYDUSWELL.NS", //Fast Moving Consumer Goods
    "BALRAMCHIN.NS", //Fast Moving Consumer Goods
    "TRIVENI.NS", //Fast Moving Consumer Goods
    "CCL.NS", //Fast Moving Consumer Goods
    "AVANTIFEED.NS", //Fast Moving Consumer Goods
    "RENUKA.NS", //Fast Moving Consumer Goods
    "KRBL.NS", //Fast Moving Consumer Goods
    "GAEL.NS", //Fast Moving Consumer Goods
    "SBIN.NS", //Financial Services
    "LICI.NS", //Financial Services
    "BAJFINANCE.NS", //Financial Services
    "KOTAKBANK.NS", //Financial Services
    "AXISBANK.NS", //Financial Services
    "BAJAJFINSV.NS", //Financial Services
    "IRFC.NS", //Financial Services
    "PFC.NS", //Financial Services
    "SBILIFE.NS", //Financial Services
    "RECLTD.NS", //Financial Services
    "HDFCLIFE.NS", //Financial Services
    "BAJAJHLDNG.NS", //Financial Services
    "BANKBARODA.NS", //Financial Services
    "PNB.NS", //Financial Services
    "SHRIRAMFIN.NS", //Financial Services
    "CHOLAFIN.NS", //Financial Services
    "POLICYBZR.NS", //Financial Services
    "IOB.NS", //Financial Services
    "ICICIPRULI.NS", //Financial Services
    "UNIONBANK.NS", //Financial Services
    "CANBK.NS", //Financial Services
    "ICICIGI.NS", //Financial Services
    "HDFCAMC.NS", //Financial Services
    "MUTHOOTFIN.NS", //Financial Services
    "IDBI.NS", //Financial Services
    "GICRE.NS", //Financial Services
    "INDUSINDBK.NS", //Financial Services
    "BSE.NS", //Financial Services
    "INDIANB.NS", //Financial Services
    "SBICARD.NS", //Financial Services
    "PAYTM.NS", //Financial Services
    "YESBANK.NS", //Financial Services
    "MOTILALOFS.NS", //Financial Services
    "UCOBANK.NS", //Financial Services
    "SUNDARMFIN.NS", //Financial Services
    "FEDERALBNK.NS", //Financial Services
    "360ONE.NS", //Financial Services
    "HUDCO.NS", //Financial Services
    "ABCAPITAL.NS", //Financial Services
    "NAM-INDIA.NS", //Financial Services
    "CENTRALBK.NS", //Financial Services
    "BANKINDIA.NS", //Financial Services
    "IDFCFIRSTB.NS", //Financial Services
    "CRISIL.NS", //Financial Services
    "AUBANK.NS", //Financial Services
    "MAHABANK.NS", //Financial Services
    "MFSL.NS", //Financial Services
    "CDSL.NS", //Financial Services
    "TATAINVEST.NS", //Financial Services
    "M&MFIN.NS", //Financial Services
    "NIACL.NS", //Financial Services
    "LICHSGFIN.NS", //Financial Services
    "MCX.NS", //Financial Services
    "CHOLAHLDNG.NS", //Financial Services
    "STARHEALTH.NS", //Financial Services
    "ISEC.NS", //Financial Services
    "ANGELONE.NS", //Financial Services
    "BANDHANBNK.NS", //Financial Services
    "KFINTECH.NS", //Financial Services
    "CAMS.NS", //Financial Services
    "POONAWALLA.NS", //Financial Services
    "PEL.NS", //Financial Services
    "PNBHOUSING.NS", //Financial Services
    "FIVESTAR.NS", //Financial Services
    "KARURVYSYA.NS", //Financial Services
    "IIFL.NS", //Financial Services
    "UTIAMC.NS", //Financial Services
    "MANAPPURAM.NS", //Financial Services
    "CGCL.NS", //Financial Services
    "IEX.NS", //Financial Services
    "HDFCBANK.NS", //Financial Services
    "CREDITACC.NS", //Financial Services
    "APTUS.NS", //Financial Services
    "AAVAS.NS", //Financial Services
    "CUB.NS", //Financial Services
    "JMFINANCIL.NS", //Financial Services
    "ICICIBANK.NS", //Financial Services
    "RBLBANK.NS", //Financial Services
    "CANFINHOME.NS", //Financial Services
    "HOMEFIRST.NS", //Financial Services
    "EQUITASBNK.NS", //Financial Services
    "INFIBEAM.NS", //Financial Services
    "TMB.NS", //Financial Services
    "CSBBANK.NS", //Financial Services
    "JKPAPER.NS", //Forest Materials
    "SUNPHARMA.NS", //Healthcare
    "DIVISLAB.NS", //Healthcare
    "CIPLA.NS", //Healthcare
    "MANKIND.NS", //Healthcare
    "TORNTPHARM.NS", //Healthcare
    "MAXHEALTH.NS", //Healthcare
    "LUPIN.NS", //Healthcare
    "APOLLOHOSP.NS", //Healthcare
    "ZYDUSLIFE.NS", //Healthcare
    "AUROPHARMA.NS", //Healthcare
    "ALKEM.NS", //Healthcare
    "ABBOTINDIA.NS", //Healthcare
    "FORTIS.NS", //Healthcare
    "GLENMARK.NS", //Healthcare
    "BIOCON.NS", //Healthcare
    "IPCALAB.NS", //Healthcare
    "GLAXO.NS", //Healthcare
    "AJANTPHARM.NS", //Healthcare
    "SYNGENE.NS", //Healthcare
    "LAURUSLABS.NS", //Healthcare
    "GLAND.NS", //Healthcare
    "MEDANTA.NS", //Healthcare
    "JBCHEPHARM.NS", //Healthcare
    "SUVENPHAR.NS", //Healthcare
    "POLYMED.NS", //Healthcare
    "NH.NS", //Healthcare
    "ASTERDM.NS", //Healthcare
    "KIMS.NS", //Healthcare
    "NATCOPHARM.NS", //Healthcare
    "LALPATHLAB.NS", //Healthcare
    "PFIZER.NS", //Healthcare
    "APLLTD.NS", //Healthcare
    "ERIS.NS", //Healthcare
    "JUBLPHARMA.NS", //Healthcare
    "RAINBOW.NS", //Healthcare
    "GRANULES.NS", //Healthcare
    "SANOFI.NS", //Healthcare
    "VIJAYA.NS", //Healthcare
    "METROPOLIS.NS", //Healthcare
    "FDC.NS", //Healthcare
    "SPARC.NS", //Healthcare
    "HIKAL.NS", //Healthcare
    "AARTIDRUGS.NS", //Healthcare
    "DRREDDY.NS", //Healthcare
    "PPLPHARMA.NS", //Healthcare
    "TCS.NS", //Information Technology
    "HCLTECH.NS", //Information Technology
    "LTIM.NS", //Information Technology
    "TECHM.NS", //Information Technology
    "OFSS.NS", //Information Technology
    "PERSISTENT.NS", //Information Technology
    "COFORGE.NS", //Information Technology
    "MPHASIS.NS", //Information Technology
    "LTTS.NS", //Information Technology
    "TATAELXSI.NS", //Information Technology
    "KPITTECH.NS", //Information Technology
    "AFFLE.NS", //Information Technology
    "CYIENT.NS", //Information Technology
    "ZENSARTECH.NS", //Information Technology
    "SONATSOFTW.NS", //Information Technology
    "BSOFT.NS", //Information Technology
    "INTELLECT.NS", //Information Technology
    "HAPPSTMNDS.NS", //Information Technology
    "LATENTVIEW.NS", //Information Technology
    "TANLA.NS", //Information Technology
    "MASTEK.NS", //Information Technology
    "INFY.NS", //Information Technology
    "MAPMYINDIA.NS", //Information Technology
    "WIPRO.NS", //Information Technology
    "BCG.NS", //Information Technology
    "SUNTV.NS", //Media Entertainment & Publication
    "PVRINOX.NS", //Media Entertainment & Publication
    "ZEEL.NS", //Media Entertainment & Publication
    "NETWORK18.NS", //Media Entertainment & Publication
    "NAZARA.NS", //Media Entertainment & Publication
    "ADANIENT.NS", //Metals & Mining
    "JSWSTEEL.NS", //Metals & Mining
    "HINDZINC.NS", //Metals & Mining
    "TATASTEEL.NS", //Metals & Mining
    "VEDL.NS", //Metals & Mining
    "HINDALCO.NS", //Metals & Mining
    "JINDALSTEL.NS", //Metals & Mining
    "JSL.NS", //Metals & Mining
    "SAIL.NS", //Metals & Mining
    "NATIONALUM.NS", //Metals & Mining
    "HINDCOPPER.NS", //Metals & Mining
    "SHYAMMETL.NS", //Metals & Mining
    "NMDC.NS", //Metals & Mining
    "NSLNISP.NS", //Metals & Mining
    "RELIANCE.NS", //Oil Gas & Consumable Fuels
    "ONGC.NS", //Oil Gas & Consumable Fuels
    "COALINDIA.NS", //Oil Gas & Consumable Fuels
    "IOC.NS", //Oil Gas & Consumable Fuels
    "GAIL.NS", //Oil Gas & Consumable Fuels
    "HINDPETRO.NS", //Oil Gas & Consumable Fuels
    "ATGL.NS", //Oil Gas & Consumable Fuels
    "OIL.NS", //Oil Gas & Consumable Fuels
    "BPCL.NS", //Oil Gas & Consumable Fuels
    "PETRONET.NS", //Oil Gas & Consumable Fuels
    "GUJGASLTD.NS", //Oil Gas & Consumable Fuels
    "IGL.NS", //Oil Gas & Consumable Fuels
    "MRPL.NS", //Oil Gas & Consumable Fuels
    "GSPL.NS", //Oil Gas & Consumable Fuels
    "CASTROLIND.NS", //Oil Gas & Consumable Fuels
    "MGL.NS", //Oil Gas & Consumable Fuels
    "NTPC.NS", //Power
    "POWERGRID.NS", //Power
    "ADANIPOWER.NS", //Power
    "ADANIGREEN.NS", //Power
    "TATAPOWER.NS", //Power
    "JSWENERGY.NS", //Power
    "ADANIENSOL.NS", //Power
    "NHPC.NS", //Power
    "TORNTPOWER.NS", //Power
    "SJVN.NS", //Power
    "NLCINDIA.NS", //Power
    "CESC.NS", //Power
    "DLF.NS", //Realty
    "LODHA.NS", //Realty
    "GODREJPROP.NS", //Realty
    "OBEROIRLTY.NS", //Realty
    "PRESTIGE.NS", //Realty
    "PHOENIXLTD.NS", //Realty
    "BRIGADE.NS", //Realty
    "SWANENERGY.NS", //Realty
    "SOBHA.NS", //Realty
    "RUSTOMJEE.NS", //Realty
    "SUNTECK.NS", //Realty
    "MAHLIFE.NS", //Realty
    "ADANIPORTS.NS", //Services
    "INDIGO.NS", //Services
    "CONCOR.NS", //Services
    "FSL.NS", //Services
    "DELHIVERY.NS", //Services
    "ECLERX.NS", //Services
    "BLUEDART.NS", //Services
    "REDINGTON.NS", //Services
    "GESHIP.NS", //Services
    "MMTC.NS", //Services
    "QUESS.NS", //Services
    "RTNINDIA.NS", //Services
    "GPPL.NS", //Services
    "TCI.NS", //Services
    "TEAMLEASE.NS", //Services
    "TCIEXP.NS", //Services
    "HGS.NS", //Services
    "MAHLOG.NS", //Services
    "BHARTIARTL.NS", //Telecommunication
    "INDUSTOWER.NS", //Telecommunication
    "IDEA.NS", //Telecommunication
    "TATACOMM.NS", //Telecommunication
    "ITI.NS", //Telecommunication
    "TEJASNET.NS", //Telecommunication
    "HFCL.NS", //Telecommunication
    "TTML.NS", //Telecommunication
    "ROUTE.NS", //Telecommunication
    "STLTECH.NS", //Telecommunication
    "PAGEIND.NS", //Textiles
    "KPRMILL.NS", //Textiles
    "TRIDENT.NS", //Textiles
    "VTL.NS", //Textiles
    "RAYMOND.NS", //Textiles
    "GARFIBRES.NS", //Textiles
    "JINDWORLD.NS", //Textiles
    "LUXIND.NS", //Textiles

  ];


  // Fetch monthly aggregated data
  const monthlyData = await getMonthlyDataForTickers(tickers);

  // console.log(monthlyData[0]); // Log the first ticker's data for verification

  if (monthlyData.length > 0) {
    await saveDataToMongoDB(monthlyData);
  } else {
    console.log('No data to save');
  }
}
// fetchData();
// Export the fetchData function
module.exports = { fetchData };