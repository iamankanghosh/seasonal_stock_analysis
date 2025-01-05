const yahooFinance = require('yahoo-finance2').default;
const { format, subMonths, startOfMonth } = require('date-fns');
const { MongoClient } = require('mongodb');

const allticker = [
  {
    "ticker_id": "RELIANCE.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "TCS.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "BHARTIARTL.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "SBIN.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ITC.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "LICI.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "HINDUNILVR.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "HCLTECH.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "LT.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "BAJFINANCE.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "SUNPHARMA.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "M&M.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "MARUTI.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "KOTAKBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ULTRACEMCO.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "AXISBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "NTPC.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "ONGC.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "TITAN.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "ADANIENT.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "POWERGRID.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "TATAMOTORS.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "HAL.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "BAJAJFINSV.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "DMART.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "TRENT.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "ADANIPORTS.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "BAJAJ-AUTO.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "ZOMATO.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "COALINDIA.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "SIEMENS.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "ASIANPAINT.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "JSWSTEEL.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "VBL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "NESTLEIND.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "BEL.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "DLF.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "IRFC.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ADANIPOWER.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "HINDZINC.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "IOC.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "TATASTEEL.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "INDIGO.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "VEDL.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "LTIM.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "GRASIM.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "TECHM.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "ADANIGREEN.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "DIVISLAB.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "PFC.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "PIDILITIND.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "EICHERMOT.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "SBILIFE.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ABB.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "RECLTD.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "LODHA.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "HDFCLIFE.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "HINDALCO.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "BAJAJHLDNG.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "TATAPOWER.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "GAIL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "BANKBARODA.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "INDHOTEL.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "PNB.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "CIPLA.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "MANKIND.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "AMBUJACEM.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "TVSMOTOR.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "NAUKRI.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "BRITANNIA.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "TORNTPHARM.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "SHRIRAMFIN.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "MAXHEALTH.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "GODREJCP.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "CGPOWER.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "CHOLAFIN.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "JSWENERGY.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "DIXON.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "OFSS.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "MOTHERSON.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "LUPIN.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "POLYCAB.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "HAVELLS.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "APOLLOHOSP.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "BOSCHLTD.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "POLICYBZR.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "IOB.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ADANIENSOL.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "PERSISTENT.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "ZYDUSLIFE.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "ICICIPRULI.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "JINDALSTEL.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "UNIONBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "SHREECEM.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "DABUR.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "TATACONSUM.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "CANBK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ICICIGI.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "INDUSTOWER.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "HDFCAMC.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "MAZDOCK.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "RVNL.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "MUTHOOTFIN.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "CUMMINSIND.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "SOLARINDS.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "HINDPETRO.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "MARICO.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "HEROMOTOCO.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "SUZLON.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "NHPC.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "IDBI.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "GODREJPROP.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "OBEROIRLTY.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "KALYANKJIL.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "GICRE.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "BHEL.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "ATGL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "OIL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "INDUSINDBK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "COLPAL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "AUROPHARMA.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "TORNTPOWER.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "BSE.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "PRESTIGE.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "INDIANB.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "TIINDIA.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "SBICARD.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ASHOKLEY.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "SRF.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "PATANJALI.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "ALKEM.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "COFORGE.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "BPCL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "POWERINDIA.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "IRCTC.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "FACT.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "ABBOTINDIA.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "PAYTM.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "YESBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "BHARATFORG.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "UNOMINDA.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "VOLTAS.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "SUPREMEIND.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "MOTILALOFS.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "COROMANDEL.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "IDEA.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "UBL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "PHOENIXLTD.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "PIIND.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "JSL.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "FORTIS.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "BALKRISIND.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "MPHASIS.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "SCHAEFFLER.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "LINDEINDIA.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "UCOBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "MRF.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "PAGEIND.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "BERGEPAINT.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "SUNDARMFIN.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "LTTS.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "FEDERALBNK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "360ONE.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "JUBLFOOD.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "TATACOMM.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "PETRONET.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "HUDCO.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ABCAPITAL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "BLUESTARCO.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "NAM-INDIA.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "CENTRALBK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "NYKAA.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "PGHH.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "CONCOR.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "BANKINDIA.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "IDFCFIRSTB.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "SAIL.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "UPL.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "THERMAX.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "GLENMARK.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "FLUOROCHEM.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "APLAPOLLO.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "CRISIL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "BIOCON.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "IPCALAB.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "APARINDS.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "ITI.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "ASTRAL.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "SJVN.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "AWL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "AUBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "MAHABANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "COCHINSHIP.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "BDL.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "KEI.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "TATAELXSI.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "KPITTECH.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "GODREJIND.NS",
    "industry": "Diversified"
  },
  {
    "ticker_id": "ACC.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "MFSL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "NATIONALUM.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "HONAUT.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "GLAXO.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "CDSL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ESCORTS.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "SONACOMS.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "JKCEMENT.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "IRB.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "EXIDEIND.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "AJANTPHARM.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "GUJGASLTD.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "KPRMILL.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "TATAINVEST.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "RADICO.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "3MINDIA.NS",
    "industry": "Diversified"
  },
  {
    "ticker_id": "METROBRAND.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "SYNGENE.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "M&MFIN.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "DALBHARAT.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "NIACL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "NLCINDIA.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "LICHSGFIN.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "DEEPAKNTR.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "LAURUSLABS.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "KEC.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "APOLLOTYRE.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "BRIGADE.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "AIAENG.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "MCX.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "GLAND.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "ENDURANCE.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "IGL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "MANYAVAR.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "ABFRL.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "MEDANTA.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "JBCHEPHARM.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "CHOLAHLDNG.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "STARHEALTH.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "SUVENPHAR.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "POLYMED.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "FSL.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "ISEC.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "SUNTV.NS",
    "industry": "Media Entertainment & Publication"
  },
  {
    "ticker_id": "EMAMILTD.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "SUMICHEM.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "EIHOTEL.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "NH.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "GODFRYPHLP.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "MSUMI.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "AMBER.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "TATACHEM.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "MRPL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "ASTERDM.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "ANGELONE.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "BANDHANBNK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "BAYERCROP.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "DELHIVERY.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "KFINTECH.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "CAMS.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "KIMS.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "NBCC.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "AFFLE.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "CARBORUNIV.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "TRITURBINE.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "CESC.NS",
    "industry": "Power"
  },
  {
    "ticker_id": "POONAWALLA.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "PEL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "NATCOPHARM.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "LALPATHLAB.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "HINDCOPPER.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "PNBHOUSING.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "PFIZER.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "WHIRLPOOL.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "SWANENERGY.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "CROMPTON.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "BASF.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "RAMCOCEM.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "FIVESTAR.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "DEVYANI.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "SUNDRMFAST.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "TIMKEN.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "RATNAMANI.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "SKFINDIA.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "ZFCVINDIA.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "KPIL.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "CHALET.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "SHYAMMETL.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "GRINDWELL.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "WELCORP.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "KANSAINER.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "TEJASNET.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "BLS.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "GSPL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "APLLTD.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "ATUL.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "CHAMBLFERT.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "CASTROLIND.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "NMDC.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "CYIENT.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "CENTURYPLY.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "BATAINDIA.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "BIKAJI.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "VGUARD.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "JBMA.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "CIEINDIA.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "VINATIORGA.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "ELGIEQUIP.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "KAJARIACER.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "ZENSARTECH.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "KARURVYSYA.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "IIFL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "ASAHIINDIA.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "FINCABLES.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "ERIS.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "DCMSHRIRAM.NS",
    "industry": "Diversified"
  },
  {
    "ticker_id": "SONATSOFTW.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "PCBL.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "UTIAMC.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "NCC.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "JUBLPHARMA.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "BEML.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "TRIDENT.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "NAVINFLUOR.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "HFCL.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "ECLERX.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "BLUEDART.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "EIDPARRY.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "CLEAN.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "MANAPPURAM.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "RAINBOW.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "CGCL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "REDINGTON.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "IEX.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "RELAXO.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "HDFCBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "SOBHA.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "TTML.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "FINPIPE.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "PRAJIND.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "BBTC.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "AARTIIND.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "BSOFT.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "DEEPAKFERT.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "CREDITACC.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "APTUS.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "JYOTHYLAB.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "VTL.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "GRANULES.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "GODREJAGRO.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "RITES.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "SANOFI.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "GRINFRA.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "GESHIP.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "DATAPATTNS.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "FINEORG.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "JUBLINGREA.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "INDIAMART.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "INTELLECT.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "KSB.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "AAVAS.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "INGERRAND.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "CUB.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "MGL.NS",
    "industry": "Oil Gas & Consumable Fuels"
  },
  {
    "ticker_id": "CEATLTD.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "PVRINOX.NS",
    "industry": "Media Entertainment & Publication"
  },
  {
    "ticker_id": "NSLNISP.NS",
    "industry": "Metals & Mining"
  },
  {
    "ticker_id": "CRAFTSMAN.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "ZYDUSWELL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "NUVOCO.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "LEMONTREE.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "WESTLIFE.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "JMFINANCIL.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "OLECTRA.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "ZEEL.NS",
    "industry": "Media Entertainment & Publication"
  },
  {
    "ticker_id": "AETHER.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "RAYMOND.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "INDIACEM.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "VIJAYA.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "TTKPRESTIG.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "NETWORK18.NS",
    "industry": "Media Entertainment & Publication"
  },
  {
    "ticker_id": "MMTC.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "SAPPHIRE.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "GRAPHITE.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "HAPPSTMNDS.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "SWSOLAR.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "ENGINERSIN.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "BALRAMCHIN.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "ICICIBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "LATENTVIEW.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "QUESS.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "RHIM.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "METROPOLIS.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "HEG.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "MEDPLUS.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "RCF.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "RBLBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "TRIVENI.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "KNRCON.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "TANLA.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "VARROC.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "CERA.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "CCL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "JKLAKSHMI.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "CANFINHOME.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "HOMEFIRST.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "MASTEK.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "INFY.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "BIRLACORPN.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "CAMPUS.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "AVANTIFEED.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "ALKYLAMINE.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "GARFIBRES.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "JUSTDIAL.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "GALAXYSURF.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "RTNINDIA.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "MAPMYINDIA.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "GPPL.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "TCI.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "GNFC.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "ROUTE.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "JINDWORLD.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "NAZARA.NS",
    "industry": "Media Entertainment & Publication"
  },
  {
    "ticker_id": "PRSMJOHNSN.NS",
    "industry": "Construction Materials"
  },
  {
    "ticker_id": "RENUKA.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "EPL.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "RUSTOMJEE.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "FDC.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "PNCINFRA.NS",
    "industry": "Construction"
  },
  {
    "ticker_id": "GSFC.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "ACI.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "ANURAS.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "CHEMPLASTS.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "EPIGRAL.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "IFBIND.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "MHRIL.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "EQUITASBNK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "SHARDACROP.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "VMART.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "SUNTECK.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "INFIBEAM.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "TMB.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "MAHLIFE.NS",
    "industry": "Realty"
  },
  {
    "ticker_id": "JKPAPER.NS",
    "industry": "Forest Materials"
  },
  {
    "ticker_id": "BORORENEW.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "KRBL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "VIPIND.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "RAJESHEXPO.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "LXCHEM.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "SHOPERSTOP.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "INDIGOPNTS.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "SPARC.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "SUPRAJIT.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "LUXIND.NS",
    "industry": "Textiles"
  },
  {
    "ticker_id": "RAIN.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "RALLIS.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "GAEL.NS",
    "industry": "Fast Moving Consumer Goods"
  },
  {
    "ticker_id": "BALAMINES.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "STLTECH.NS",
    "industry": "Telecommunication"
  },
  {
    "ticker_id": "GUJALKALI.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "GOCOLORS.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "GMMPFAUDLR.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "MTARTECH.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "CSBBANK.NS",
    "industry": "Financial Services"
  },
  {
    "ticker_id": "TEAMLEASE.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "ORIENTELEC.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "VAIBHAVGBL.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "HIKAL.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "PRINCEPIPE.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "GREENPANEL.NS",
    "industry": "Consumer Durables"
  },
  {
    "ticker_id": "ROSSARI.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "POLYPLEX.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "NOCIL.NS",
    "industry": "Chemicals"
  },
  {
    "ticker_id": "RBA.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "AARTIDRUGS.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "JAMNAAUTO.NS",
    "industry": "Automobile and Auto Components"
  },
  {
    "ticker_id": "UFLEX.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "WIPRO.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "HGS.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "TCIEXP.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "DELTACORP.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "MAHLOG.NS",
    "industry": "Services"
  },
  {
    "ticker_id": "EASEMYTRIP.NS",
    "industry": "Consumer Services"
  },
  {
    "ticker_id": "HLEGLAS.NS",
    "industry": "Capital Goods"
  },
  {
    "ticker_id": "BCG.NS",
    "industry": "Information Technology"
  },
  {
    "ticker_id": "DRREDDY.NS",
    "industry": "Healthcare"
  },
  {
    "ticker_id": "PPLPHARMA.NS",
    "industry": "Healthcare"
  }
]
// MongoDB connection settings
const mongoURI = 'mongodb+srv://ankan_user:ankan_user@cluster0.qhihx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'stock_data_lastyear';
const collectionName = 'monthly_data';

// Function to fetch and aggregate monthly stock data
async function getMonthlyDataForTickers(tickerList) {
  const endDate = new Date();
  const startDate = startOfMonth(subMonths(endDate, 50));

  const results = [];

  for (const ticker of tickerList) {
    // console.log(ticker.ticker_id);
    try {
      const stockInfo = await yahooFinance.quote(ticker.ticker_id);
      const stockName = stockInfo.longName || stockInfo.shortName || 'Unknown';
      const earningdate = stockInfo.earningsTimestamp
        ? new Date(stockInfo.earningsTimestamp).toISOString().split('T')[0]
        : 'Unknown';

      const marketCapInCr = stockInfo.marketCap
        ? (stockInfo.marketCap / 1e7).toFixed(2) + ' Cr'
        : 'Unknown';



      const data = await yahooFinance.historical(ticker.ticker_id, {
        period1: startDate.toISOString(),
        period2: endDate.toISOString(),
        interval: '1d',
      });
      if (!data || data.length === 0) {
        console.error(`No data found for ticker.ticker_id ${ticker.ticker_id} from Yahoo Finance.`);
        continue; // Skip this ticker and move to the next one
      }


      // Aggregate daily data into monthly and prepare result object
      const monthlyData = aggregateMonthly(data, ticker.ticker_id);
      results.push({
        ticker: ticker.ticker_id,
        name: stockName,
        result: monthlyData,
        industry: ticker.industry,
        marketCapInCr: marketCapInCr,
        earningdate: earningdate,
      });
      // console.log(results);
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
              industry: stockData.industry,
              marketCapInCr: stockData.marketCapInCr,
              earningdate: stockData.earningdate,
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
  // console.log(allticker[0]);
  // const tickers = ['SBIN.NS','^NSEI',  'TCS.NS', 'INFY.NS','INDHOTEL.NS']; // List of ticker symbols
  // const tickers = [
  //   '^NSEI',         // NIFTY 50
  //   '^NSEBANK',      // NIFTY Bank ------------------------------------------------------------------------
  //   '^CNXFIN',       // NIFTY Financial Services ------------------------------------------------------------------------
  //   '^CNXAUTO',      // NIFTY Auto ------------------------------------------------------------------------
  //   '^CNXFMCG',      // NIFTY FMCG ------------------------------------------------------------------------
  //   '^CNXIT',        // NIFTY IT ------------------------------------------------------------------------
  //   '^CNXPHARMA',    // NIFTY Pharma ------------------------------------------------------------------------
  //   '^CNXMETAL',     // NIFTY Metal ------------------------------------------------------------------------
  //   '^CNXREALTY',    // NIFTY Realty ------------------------------------------------------------------------
  //   '^CNXENERGY',    // NIFTY Energy ------------------------------------------------------------------------
  //   '^CNXINFRA',     // NIFTY Infrastructure ------------------------------------------------------------------------
  //   '^CNXCMDT',    // NIFTY Commodities ------------------------------------------------------------------------
  //   '^CNXMEDIA',     // NIFTY Media ------------------------------------------------------------------------
  //   '^CNXPSUBANK',   // NIFTY PSU Bank ------------------------------------------------------------------------

  //   "M&M.NS", //Automobile and Auto Components
  //   "MARUTI.NS", //Automobile and Auto Components
  //   "TATAMOTORS.NS", //Automobile and Auto Components
  //   "BAJAJ-AUTO.NS", //Automobile and Auto Components
  //   "EICHERMOT.NS", //Automobile and Auto Components
  //   "TVSMOTOR.NS", //Automobile and Auto Components
  //   "MOTHERSON.NS", //Automobile and Auto Components
  //   "BOSCHLTD.NS", //Automobile and Auto Components
  //   "HEROMOTOCO.NS", //Automobile and Auto Components
  //   "TIINDIA.NS", //Automobile and Auto Components
  //   "UNOMINDA.NS", //Automobile and Auto Components
  //   "BALKRISIND.NS", //Automobile and Auto Components
  //   "SCHAEFFLER.NS", //Automobile and Auto Components
  //   "MRF.NS", //Automobile and Auto Components
  //   "SONACOMS.NS", //Automobile and Auto Components
  //   "EXIDEIND.NS", //Automobile and Auto Components
  //   "APOLLOTYRE.NS", //Automobile and Auto Components
  //   "ENDURANCE.NS", //Automobile and Auto Components
  //   "MSUMI.NS", //Automobile and Auto Components
  //   "SUNDRMFAST.NS", //Automobile and Auto Components
  //   "ZFCVINDIA.NS", //Automobile and Auto Components
  //   "JBMA.NS", //Automobile and Auto Components
  //   "CIEINDIA.NS", //Automobile and Auto Components
  //   "ASAHIINDIA.NS", //Automobile and Auto Components
  //   "CEATLTD.NS", //Automobile and Auto Components
  //   "CRAFTSMAN.NS", //Automobile and Auto Components
  //   "OLECTRA.NS", //Automobile and Auto Components
  //   "VARROC.NS", //Automobile and Auto Components
  //   "SUPRAJIT.NS", //Automobile and Auto Components
  //   "JAMNAAUTO.NS", //Automobile and Auto Components
  //   "HAL.NS", //Capital Goods
  //   "SIEMENS.NS", //Capital Goods
  //   "BEL.NS", //Capital Goods
  //   "ABB.NS", //Capital Goods
  //   "CGPOWER.NS", //Capital Goods
  //   "POLYCAB.NS", //Capital Goods
  //   "MAZDOCK.NS", //Capital Goods
  //   "CUMMINSIND.NS", //Capital Goods
  //   "SUZLON.NS", //Capital Goods
  //   "BHEL.NS", //Capital Goods
  //   "ASHOKLEY.NS", //Capital Goods
  //   "POWERINDIA.NS", //Capital Goods
  //   "BHARATFORG.NS", //Capital Goods
  //   "SUPREMEIND.NS", //Capital Goods
  //   "THERMAX.NS", //Capital Goods
  //   "APLAPOLLO.NS", //Capital Goods
  //   "APARINDS.NS", //Capital Goods
  //   "ASTRAL.NS", //Capital Goods
  //   "COCHINSHIP.NS", //Capital Goods
  //   "BDL.NS", //Capital Goods
  //   "KEI.NS", //Capital Goods
  //   "HONAUT.NS", //Capital Goods
  //   "ESCORTS.NS", //Capital Goods
  //   "KEC.NS", //Capital Goods
  //   "AIAENG.NS", //Capital Goods
  //   "CARBORUNIV.NS", //Capital Goods
  //   "TRITURBINE.NS", //Capital Goods
  //   "TIMKEN.NS", //Capital Goods
  //   "RATNAMANI.NS", //Capital Goods
  //   "SKFINDIA.NS", //Capital Goods
  //   "GRINDWELL.NS", //Capital Goods
  //   "WELCORP.NS", //Capital Goods
  //   "ELGIEQUIP.NS", //Capital Goods
  //   "FINCABLES.NS", //Capital Goods
  //   "BEML.NS", //Capital Goods
  //   "FINPIPE.NS", //Capital Goods
  //   "PRAJIND.NS", //Capital Goods
  //   "DATAPATTNS.NS", //Capital Goods
  //   "KSB.NS", //Capital Goods
  //   "INGERRAND.NS", //Capital Goods
  //   "GRAPHITE.NS", //Capital Goods
  //   "RHIM.NS", //Capital Goods
  //   "HEG.NS", //Capital Goods
  //   "EPL.NS", //Capital Goods
  //   "BORORENEW.NS", //Capital Goods
  //   "GMMPFAUDLR.NS", //Capital Goods
  //   "MTARTECH.NS", //Capital Goods
  //   "PRINCEPIPE.NS", //Capital Goods
  //   "POLYPLEX.NS", //Capital Goods
  //   "UFLEX.NS", //Capital Goods
  //   "HLEGLAS.NS", //Capital Goods
  //   "PIDILITIND.NS", //Chemicals
  //   "SOLARINDS.NS", //Chemicals
  //   "SRF.NS", //Chemicals
  //   "FACT.NS", //Chemicals
  //   "COROMANDEL.NS", //Chemicals
  //   "PIIND.NS", //Chemicals
  //   "LINDEINDIA.NS", //Chemicals
  //   "UPL.NS", //Chemicals
  //   "FLUOROCHEM.NS", //Chemicals
  //   "DEEPAKNTR.NS", //Chemicals
  //   "SUMICHEM.NS", //Chemicals
  //   "TATACHEM.NS", //Chemicals
  //   "BAYERCROP.NS", //Chemicals
  //   "BASF.NS", //Chemicals
  //   "ATUL.NS", //Chemicals
  //   "CHAMBLFERT.NS", //Chemicals
  //   "VINATIORGA.NS", //Chemicals
  //   "PCBL.NS", //Chemicals
  //   "NAVINFLUOR.NS", //Chemicals
  //   "EIDPARRY.NS", //Chemicals
  //   "CLEAN.NS", //Chemicals
  //   "AARTIIND.NS", //Chemicals
  //   "DEEPAKFERT.NS", //Chemicals
  //   "FINEORG.NS", //Chemicals
  //   "JUBLINGREA.NS", //Chemicals
  //   "AETHER.NS", //Chemicals
  //   "RCF.NS", //Chemicals
  //   "ALKYLAMINE.NS", //Chemicals
  //   "GALAXYSURF.NS", //Chemicals
  //   "GNFC.NS", //Chemicals
  //   "GSFC.NS", //Chemicals
  //   "ACI.NS", //Chemicals
  //   "ANURAS.NS", //Chemicals
  //   "CHEMPLASTS.NS", //Chemicals
  //   "EPIGRAL.NS", //Chemicals
  //   "SHARDACROP.NS", //Chemicals
  //   "LXCHEM.NS", //Chemicals
  //   "RAIN.NS", //Chemicals
  //   "RALLIS.NS", //Chemicals
  //   "BALAMINES.NS", //Chemicals
  //   "GUJALKALI.NS", //Chemicals
  //   "ROSSARI.NS", //Chemicals
  //   "NOCIL.NS", //Chemicals
  //   "LT.NS", //Construction
  //   "RVNL.NS", //Construction
  //   "IRB.NS", //Construction
  //   "NBCC.NS", //Construction
  //   "KPIL.NS", //Construction
  //   "NCC.NS", //Construction
  //   "RITES.NS", //Construction
  //   "GRINFRA.NS", //Construction
  //   "SWSOLAR.NS", //Construction
  //   "ENGINERSIN.NS", //Construction
  //   "KNRCON.NS", //Construction
  //   "PNCINFRA.NS", //Construction
  //   "ULTRACEMCO.NS", //Construction Materials
  //   "GRASIM.NS", //Construction Materials
  //   "AMBUJACEM.NS", //Construction Materials
  //   "SHREECEM.NS", //Construction Materials
  //   "ACC.NS", //Construction Materials
  //   "JKCEMENT.NS", //Construction Materials
  //   "DALBHARAT.NS", //Construction Materials
  //   "RAMCOCEM.NS", //Construction Materials
  //   "NUVOCO.NS", //Construction Materials
  //   "INDIACEM.NS", //Construction Materials
  //   "JKLAKSHMI.NS", //Construction Materials
  //   "BIRLACORPN.NS", //Construction Materials
  //   "PRSMJOHNSN.NS", //Construction Materials
  //   "TITAN.NS", //Consumer Durables
  //   "ASIANPAINT.NS", //Consumer Durables
  //   "DIXON.NS", //Consumer Durables
  //   "HAVELLS.NS", //Consumer Durables
  //   "KALYANKJIL.NS", //Consumer Durables
  //   "VOLTAS.NS", //Consumer Durables
  //   "BERGEPAINT.NS", //Consumer Durables
  //   "BLUESTARCO.NS", //Consumer Durables
  //   "METROBRAND.NS", //Consumer Durables
  //   "AMBER.NS", //Consumer Durables
  //   "CROMPTON.NS", //Consumer Durables
  //   "WHIRLPOOL.NS", //Consumer Durables
  //   "KANSAINER.NS", //Consumer Durables
  //   "CENTURYPLY.NS", //Consumer Durables
  //   "BATAINDIA.NS", //Consumer Durables
  //   "VGUARD.NS", //Consumer Durables
  //   "KAJARIACER.NS", //Consumer Durables
  //   "RELAXO.NS", //Consumer Durables
  //   "TTKPRESTIG.NS", //Consumer Durables
  //   "CERA.NS", //Consumer Durables
  //   "CAMPUS.NS", //Consumer Durables
  //   "IFBIND.NS", //Consumer Durables
  //   "VIPIND.NS", //Consumer Durables
  //   "RAJESHEXPO.NS", //Consumer Durables
  //   "INDIGOPNTS.NS", //Consumer Durables
  //   "ORIENTELEC.NS", //Consumer Durables
  //   "VAIBHAVGBL.NS", //Consumer Durables
  //   "GREENPANEL.NS", //Consumer Durables
  //   "DMART.NS", //Consumer Services
  //   "TRENT.NS", //Consumer Services
  //   "ZOMATO.NS", //Consumer Services
  //   "INDHOTEL.NS", //Consumer Services
  //   "NAUKRI.NS", //Consumer Services
  //   "IRCTC.NS", //Consumer Services
  //   "JUBLFOOD.NS", //Consumer Services
  //   "NYKAA.NS", //Consumer Services
  //   "MANYAVAR.NS", //Consumer Services
  //   "ABFRL.NS", //Consumer Services
  //   "EIHOTEL.NS", //Consumer Services
  //   "DEVYANI.NS", //Consumer Services
  //   "CHALET.NS", //Consumer Services
  //   "BLS.NS", //Consumer Services
  //   "INDIAMART.NS", //Consumer Services
  //   "LEMONTREE.NS", //Consumer Services
  //   "WESTLIFE.NS", //Consumer Services
  //   "SAPPHIRE.NS", //Consumer Services
  //   "MEDPLUS.NS", //Consumer Services
  //   "JUSTDIAL.NS", //Consumer Services
  //   "MHRIL.NS", //Consumer Services
  //   "VMART.NS", //Consumer Services
  //   "SHOPERSTOP.NS", //Consumer Services
  //   "GOCOLORS.NS", //Consumer Services
  //   "RBA.NS", //Consumer Services
  //   "DELTACORP.NS", //Consumer Services
  //   "EASEMYTRIP.NS", //Consumer Services
  //   "GODREJIND.NS", //Diversified
  //   "3MINDIA.NS", //Diversified
  //   "DCMSHRIRAM.NS", //Diversified
  //   "ITC.NS", //Fast Moving Consumer Goods
  //   "HINDUNILVR.NS", //Fast Moving Consumer Goods
  //   "VBL.NS", //Fast Moving Consumer Goods
  //   "NESTLEIND.NS", //Fast Moving Consumer Goods
  //   "BRITANNIA.NS", //Fast Moving Consumer Goods
  //   "GODREJCP.NS", //Fast Moving Consumer Goods
  //   "DABUR.NS", //Fast Moving Consumer Goods
  //   "TATACONSUM.NS", //Fast Moving Consumer Goods
  //   "MARICO.NS", //Fast Moving Consumer Goods
  //   "COLPAL.NS", //Fast Moving Consumer Goods
  //   "PATANJALI.NS", //Fast Moving Consumer Goods
  //   "UBL.NS", //Fast Moving Consumer Goods
  //   "PGHH.NS", //Fast Moving Consumer Goods
  //   "AWL.NS", //Fast Moving Consumer Goods
  //   "RADICO.NS", //Fast Moving Consumer Goods
  //   "EMAMILTD.NS", //Fast Moving Consumer Goods
  //   "GODFRYPHLP.NS", //Fast Moving Consumer Goods
  //   "BIKAJI.NS", //Fast Moving Consumer Goods
  //   "BBTC.NS", //Fast Moving Consumer Goods
  //   "JYOTHYLAB.NS", //Fast Moving Consumer Goods
  //   "GODREJAGRO.NS", //Fast Moving Consumer Goods
  //   "ZYDUSWELL.NS", //Fast Moving Consumer Goods
  //   "BALRAMCHIN.NS", //Fast Moving Consumer Goods
  //   "TRIVENI.NS", //Fast Moving Consumer Goods
  //   "CCL.NS", //Fast Moving Consumer Goods
  //   "AVANTIFEED.NS", //Fast Moving Consumer Goods
  //   "RENUKA.NS", //Fast Moving Consumer Goods
  //   "KRBL.NS", //Fast Moving Consumer Goods
  //   "GAEL.NS", //Fast Moving Consumer Goods
  //   "SBIN.NS", //Financial Services
  //   "LICI.NS", //Financial Services
  //   "BAJFINANCE.NS", //Financial Services
  //   "KOTAKBANK.NS", //Financial Services
  //   "AXISBANK.NS", //Financial Services
  //   "BAJAJFINSV.NS", //Financial Services
  //   "IRFC.NS", //Financial Services
  //   "PFC.NS", //Financial Services
  //   "SBILIFE.NS", //Financial Services
  //   "RECLTD.NS", //Financial Services
  //   "HDFCLIFE.NS", //Financial Services
  //   "BAJAJHLDNG.NS", //Financial Services
  //   "BANKBARODA.NS", //Financial Services
  //   "PNB.NS", //Financial Services
  //   "SHRIRAMFIN.NS", //Financial Services
  //   "CHOLAFIN.NS", //Financial Services
  //   "POLICYBZR.NS", //Financial Services
  //   "IOB.NS", //Financial Services
  //   "ICICIPRULI.NS", //Financial Services
  //   "UNIONBANK.NS", //Financial Services
  //   "CANBK.NS", //Financial Services
  //   "ICICIGI.NS", //Financial Services
  //   "HDFCAMC.NS", //Financial Services
  //   "MUTHOOTFIN.NS", //Financial Services
  //   "IDBI.NS", //Financial Services
  //   "GICRE.NS", //Financial Services
  //   "INDUSINDBK.NS", //Financial Services
  //   "BSE.NS", //Financial Services
  //   "INDIANB.NS", //Financial Services
  //   "SBICARD.NS", //Financial Services
  //   "PAYTM.NS", //Financial Services
  //   "YESBANK.NS", //Financial Services
  //   "MOTILALOFS.NS", //Financial Services
  //   "UCOBANK.NS", //Financial Services
  //   "SUNDARMFIN.NS", //Financial Services
  //   "FEDERALBNK.NS", //Financial Services
  //   "360ONE.NS", //Financial Services
  //   "HUDCO.NS", //Financial Services
  //   "ABCAPITAL.NS", //Financial Services
  //   "NAM-INDIA.NS", //Financial Services
  //   "CENTRALBK.NS", //Financial Services
  //   "BANKINDIA.NS", //Financial Services
  //   "IDFCFIRSTB.NS", //Financial Services
  //   "CRISIL.NS", //Financial Services
  //   "AUBANK.NS", //Financial Services
  //   "MAHABANK.NS", //Financial Services
  //   "MFSL.NS", //Financial Services
  //   "CDSL.NS", //Financial Services
  //   "TATAINVEST.NS", //Financial Services
  //   "M&MFIN.NS", //Financial Services
  //   "NIACL.NS", //Financial Services
  //   "LICHSGFIN.NS", //Financial Services
  //   "MCX.NS", //Financial Services
  //   "CHOLAHLDNG.NS", //Financial Services
  //   "STARHEALTH.NS", //Financial Services
  //   "ISEC.NS", //Financial Services
  //   "ANGELONE.NS", //Financial Services
  //   "BANDHANBNK.NS", //Financial Services
  //   "KFINTECH.NS", //Financial Services
  //   "CAMS.NS", //Financial Services
  //   "POONAWALLA.NS", //Financial Services
  //   "PEL.NS", //Financial Services
  //   "PNBHOUSING.NS", //Financial Services
  //   "FIVESTAR.NS", //Financial Services
  //   "KARURVYSYA.NS", //Financial Services
  //   "IIFL.NS", //Financial Services
  //   "UTIAMC.NS", //Financial Services
  //   "MANAPPURAM.NS", //Financial Services
  //   "CGCL.NS", //Financial Services
  //   "IEX.NS", //Financial Services
  //   "HDFCBANK.NS", //Financial Services
  //   "CREDITACC.NS", //Financial Services
  //   "APTUS.NS", //Financial Services
  //   "AAVAS.NS", //Financial Services
  //   "CUB.NS", //Financial Services
  //   "JMFINANCIL.NS", //Financial Services
  //   "ICICIBANK.NS", //Financial Services
  //   "RBLBANK.NS", //Financial Services
  //   "CANFINHOME.NS", //Financial Services
  //   "HOMEFIRST.NS", //Financial Services
  //   "EQUITASBNK.NS", //Financial Services
  //   "INFIBEAM.NS", //Financial Services
  //   "TMB.NS", //Financial Services
  //   "CSBBANK.NS", //Financial Services
  //   "JKPAPER.NS", //Forest Materials
  //   "SUNPHARMA.NS", //Healthcare
  //   "DIVISLAB.NS", //Healthcare
  //   "CIPLA.NS", //Healthcare
  //   "MANKIND.NS", //Healthcare
  //   "TORNTPHARM.NS", //Healthcare
  //   "MAXHEALTH.NS", //Healthcare
  //   "LUPIN.NS", //Healthcare
  //   "APOLLOHOSP.NS", //Healthcare
  //   "ZYDUSLIFE.NS", //Healthcare
  //   "AUROPHARMA.NS", //Healthcare
  //   "ALKEM.NS", //Healthcare
  //   "ABBOTINDIA.NS", //Healthcare
  //   "FORTIS.NS", //Healthcare
  //   "GLENMARK.NS", //Healthcare
  //   "BIOCON.NS", //Healthcare
  //   "IPCALAB.NS", //Healthcare
  //   "GLAXO.NS", //Healthcare
  //   "AJANTPHARM.NS", //Healthcare
  //   "SYNGENE.NS", //Healthcare
  //   "LAURUSLABS.NS", //Healthcare
  //   "GLAND.NS", //Healthcare
  //   "MEDANTA.NS", //Healthcare
  //   "JBCHEPHARM.NS", //Healthcare
  //   "SUVENPHAR.NS", //Healthcare
  //   "POLYMED.NS", //Healthcare
  //   "NH.NS", //Healthcare
  //   "ASTERDM.NS", //Healthcare
  //   "KIMS.NS", //Healthcare
  //   "NATCOPHARM.NS", //Healthcare
  //   "LALPATHLAB.NS", //Healthcare
  //   "PFIZER.NS", //Healthcare
  //   "APLLTD.NS", //Healthcare
  //   "ERIS.NS", //Healthcare
  //   "JUBLPHARMA.NS", //Healthcare
  //   "RAINBOW.NS", //Healthcare
  //   "GRANULES.NS", //Healthcare
  //   "SANOFI.NS", //Healthcare
  //   "VIJAYA.NS", //Healthcare
  //   "METROPOLIS.NS", //Healthcare
  //   "FDC.NS", //Healthcare
  //   "SPARC.NS", //Healthcare
  //   "HIKAL.NS", //Healthcare
  //   "AARTIDRUGS.NS", //Healthcare
  //   "DRREDDY.NS", //Healthcare
  //   "PPLPHARMA.NS", //Healthcare
  //   "TCS.NS", //Information Technology
  //   "HCLTECH.NS", //Information Technology
  //   "LTIM.NS", //Information Technology
  //   "TECHM.NS", //Information Technology
  //   "OFSS.NS", //Information Technology
  //   "PERSISTENT.NS", //Information Technology
  //   "COFORGE.NS", //Information Technology
  //   "MPHASIS.NS", //Information Technology
  //   "LTTS.NS", //Information Technology
  //   "TATAELXSI.NS", //Information Technology
  //   "KPITTECH.NS", //Information Technology
  //   "AFFLE.NS", //Information Technology
  //   "CYIENT.NS", //Information Technology
  //   "ZENSARTECH.NS", //Information Technology
  //   "SONATSOFTW.NS", //Information Technology
  //   "BSOFT.NS", //Information Technology
  //   "INTELLECT.NS", //Information Technology
  //   "HAPPSTMNDS.NS", //Information Technology
  //   "LATENTVIEW.NS", //Information Technology
  //   "TANLA.NS", //Information Technology
  //   "MASTEK.NS", //Information Technology
  //   "INFY.NS", //Information Technology
  //   "MAPMYINDIA.NS", //Information Technology
  //   "WIPRO.NS", //Information Technology
  //   "BCG.NS", //Information Technology
  //   "SUNTV.NS", //Media Entertainment & Publication
  //   "PVRINOX.NS", //Media Entertainment & Publication
  //   "ZEEL.NS", //Media Entertainment & Publication
  //   "NETWORK18.NS", //Media Entertainment & Publication
  //   "NAZARA.NS", //Media Entertainment & Publication
  //   "ADANIENT.NS", //Metals & Mining
  //   "JSWSTEEL.NS", //Metals & Mining
  //   "HINDZINC.NS", //Metals & Mining
  //   "TATASTEEL.NS", //Metals & Mining
  //   "VEDL.NS", //Metals & Mining
  //   "HINDALCO.NS", //Metals & Mining
  //   "JINDALSTEL.NS", //Metals & Mining
  //   "JSL.NS", //Metals & Mining
  //   "SAIL.NS", //Metals & Mining
  //   "NATIONALUM.NS", //Metals & Mining
  //   "HINDCOPPER.NS", //Metals & Mining
  //   "SHYAMMETL.NS", //Metals & Mining
  //   "NMDC.NS", //Metals & Mining
  //   "NSLNISP.NS", //Metals & Mining
  //   "RELIANCE.NS", //Oil Gas & Consumable Fuels
  //   "ONGC.NS", //Oil Gas & Consumable Fuels
  //   "COALINDIA.NS", //Oil Gas & Consumable Fuels
  //   "IOC.NS", //Oil Gas & Consumable Fuels
  //   "GAIL.NS", //Oil Gas & Consumable Fuels
  //   "HINDPETRO.NS", //Oil Gas & Consumable Fuels
  //   "ATGL.NS", //Oil Gas & Consumable Fuels
  //   "OIL.NS", //Oil Gas & Consumable Fuels
  //   "BPCL.NS", //Oil Gas & Consumable Fuels
  //   "PETRONET.NS", //Oil Gas & Consumable Fuels
  //   "GUJGASLTD.NS", //Oil Gas & Consumable Fuels
  //   "IGL.NS", //Oil Gas & Consumable Fuels
  //   "MRPL.NS", //Oil Gas & Consumable Fuels
  //   "GSPL.NS", //Oil Gas & Consumable Fuels
  //   "CASTROLIND.NS", //Oil Gas & Consumable Fuels
  //   "MGL.NS", //Oil Gas & Consumable Fuels
  //   "NTPC.NS", //Power
  //   "POWERGRID.NS", //Power
  //   "ADANIPOWER.NS", //Power
  //   "ADANIGREEN.NS", //Power
  //   "TATAPOWER.NS", //Power
  //   "JSWENERGY.NS", //Power
  //   "ADANIENSOL.NS", //Power
  //   "NHPC.NS", //Power
  //   "TORNTPOWER.NS", //Power
  //   "SJVN.NS", //Power
  //   "NLCINDIA.NS", //Power
  //   "CESC.NS", //Power
  //   "DLF.NS", //Realty
  //   "LODHA.NS", //Realty
  //   "GODREJPROP.NS", //Realty
  //   "OBEROIRLTY.NS", //Realty
  //   "PRESTIGE.NS", //Realty
  //   "PHOENIXLTD.NS", //Realty
  //   "BRIGADE.NS", //Realty
  //   "SWANENERGY.NS", //Realty
  //   "SOBHA.NS", //Realty
  //   "RUSTOMJEE.NS", //Realty
  //   "SUNTECK.NS", //Realty
  //   "MAHLIFE.NS", //Realty
  //   "ADANIPORTS.NS", //Services
  //   "INDIGO.NS", //Services
  //   "CONCOR.NS", //Services
  //   "FSL.NS", //Services
  //   "DELHIVERY.NS", //Services
  //   "ECLERX.NS", //Services
  //   "BLUEDART.NS", //Services
  //   "REDINGTON.NS", //Services
  //   "GESHIP.NS", //Services
  //   "MMTC.NS", //Services
  //   "QUESS.NS", //Services
  //   "RTNINDIA.NS", //Services
  //   "GPPL.NS", //Services
  //   "TCI.NS", //Services
  //   "TEAMLEASE.NS", //Services
  //   "TCIEXP.NS", //Services
  //   "HGS.NS", //Services
  //   "MAHLOG.NS", //Services
  //   "BHARTIARTL.NS", //Telecommunication
  //   "INDUSTOWER.NS", //Telecommunication
  //   "IDEA.NS", //Telecommunication
  //   "TATACOMM.NS", //Telecommunication
  //   "ITI.NS", //Telecommunication
  //   "TEJASNET.NS", //Telecommunication
  //   "HFCL.NS", //Telecommunication
  //   "TTML.NS", //Telecommunication
  //   "ROUTE.NS", //Telecommunication
  //   "STLTECH.NS", //Telecommunication
  //   "PAGEIND.NS", //Textiles
  //   "KPRMILL.NS", //Textiles
  //   "TRIDENT.NS", //Textiles
  //   "VTL.NS", //Textiles
  //   "RAYMOND.NS", //Textiles
  //   "GARFIBRES.NS", //Textiles
  //   "JINDWORLD.NS", //Textiles
  //   "LUXIND.NS", //Textiles

  // ];


  // Fetch monthly aggregated data
  const monthlyData = await getMonthlyDataForTickers(allticker);

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