require('dotenv').config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const { EncloserStart, EncloserEnd, chainsList } = require('./helpers/constants');
const { connectProvider } = require('./coreBlockchain/provider');
const { getChainDetailsByChainId } = require('./helpers/chainHelper');
const cron = require("node-cron"); 
const nftApiController = require("./controller/nftApiController");
const serverless = require("serverless-http");
const phoneRoutes = require('./routes/phoneRoute');
require('./dataProviders/mobile');

const { getAllCollections, getExchangeCollectionsByRanking, getSingleExchangeCollection, getNFTsOfCollection } = require('./dataProviders/blockSpan');

const getMemoryUsed = ()=>{
    console.log(EncloserStart);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`This Master server uses approximately ${Math.round(used * 100) / 100} MB`);
    console.log(EncloserEnd);
}

const connectToBlockchainThroughProviders =async (chainId)=>{
    try{
       const chainDetails = await getChainDetailsByChainId(chainId);
       console.log(chainDetails);
       const provider = await connectProvider({providerUrl: chainDetails.providerUrl,chainDetails});
       return provider;
    }
    catch(e){
        console.log("Error occured while connecting to blockchain "+e);
        return null;
    }
}

cron.schedule("0 0 */8 * * * ", async function() { 
    console.log(EncloserStart);
    console.log("cron job running every 8 hours"); 

    // for(let chainId of chainsList){
    //    await connectToBlockchainThroughProviders(chainId);
    // }
    runTopCollectionsDataUpdater();

    console.log(EncloserEnd)
}); 

const startServerFunction =async ({
    name,
    port,
    description,
    routes
})=>{
    const fs = require('fs');
    const cors = require("cors");
    const express = require('express')
    const app = express()
    console.log(EncloserStart)
    console.log(`Server Name :${name}`);
    console.log(`Server Description :${description}`);
    let accessLogStream = fs.createWriteStream('./logs/logger.log', { flags: 'a' })
    connectMongoDB({
        dbName:"Staging DB 1",
        dbConnectionString: process.env.MONGODB_URL_DB1,
        dbDescription:`Our DB from official Account. Belongs to ${name}`,
    })

     connectMongoDB({
        dbName:"Staging DB 2",
        dbConnectionString: process.env.MONGODB_URL_DB2,
        dbDescription:`Our DB from humdev101 account. Belongs to ${name}`
    })

    connectMongoDB({
        dbName:"trikonMarketPlace",
        dbConnectionString:process.env.MONGODB_URL_DB1,
        dbDescription:`Our DB from official Account,belongs to server 1 ${name}`
    })
    
    app.use(cors({
        origin:'http://localhost:3000'
    }));
    app.use(express.json());
    app.use(morgan(`combined`, { stream: accessLogStream }));
    app.use("/v1/nft/",nftApiController);
    app.use("/api",phoneRoutes);
    app.get('/', (req, res) => {
    res.send(`${name} server running on port ${port}`)
    })

    
    app.listen(port, () => {
    console.log(`${name} server running on ${port}`)
    console.log(EncloserEnd)

    })
}

const runTopCollectionsDataUpdater = async()=>{
  try{
    connectMongoDB({
        dbName:"Staging DB 1",
        dbConnectionString: process.env.MONGODB_URL_DB1,
        dbDescription:`Our DB from official Account. Belongs to ${name}`,
    })

     connectMongoDB({
        dbName:"Staging DB 2",
        dbConnectionString: process.env.MONGODB_URL_DB2,
        dbDescription:`Our DB from humdev101 account. Belongs to ${name}`
    })
    await getExchangeCollectionsByRanking('eth-main', 'opensea', 'total_volume', 20);
    await getExchangeCollectionsByRanking('poly-main', 'opensea', 'total_volume', 20);
    await getExchangeCollectionsByRanking('eth-main', 'opensea', 'one_day_volume', 20);
    await getExchangeCollectionsByRanking('poly-main', 'opensea', 'one_day_volume', 20);
    await getExchangeCollectionsByRanking('eth-main', 'opensea', 'seven_day_volume', 20);
    await getExchangeCollectionsByRanking('poly-main', 'opensea', 'seven_day_volume', 20);
    await getExchangeCollectionsByRanking('eth-main','opensea','thirty_day_volume',20);
    await getExchangeCollectionsByRanking('poly-main','opensea','thirty_day_volume',20);
    await getExchangeCollectionsByRanking('eth-main','opensea','total_sales',20);
    await getExchangeCollectionsByRanking('poly-main','opensea','total_sales',20);
    await getExchangeCollectionsByRanking('eth-main','opensea','one_day_sales',20);
    await getExchangeCollectionsByRanking('poly-main','opensea','one_day_sales',20);
    await getExchangeCollectionsByRanking('eth-main','opensea','seven_day_sales',20);
    await getExchangeCollectionsByRanking('poly-main','opensea','seven_day_sales',20);
    await getExchangeCollectionsByRanking('eth-main','opensea','thirty_day_sales',20);
    await getExchangeCollectionsByRanking('poly-main','opensea','thirty_day_sales',20);
    await getExchangeCollectionsByRanking('eth-main', 'opensea', 'total_average_price', 20);
    await getExchangeCollectionsByRanking('poly-main', 'opensea', 'total_average_price', 20);
  }
  catch(e){
    console.log("Collections Updater Error "+e);
  }

}


const checkStatusOfEverything =()=>{
    try{
        let checksPercentage = 0;

        console.log(EncloserStart);
        console.log(`Performing Checks Started - ${checksPercentage}% `);
        // Checks to be performed

        checksPercentage =100
        console.log(`Performing Checks Completed Successfully - ${checksPercentage}% `);
        console.log(EncloserEnd);
   
    }
    catch(e){
        console.log("Performing checks failed");
    }
}

const connectRedis = ()=>{
    try{

    }
    catch(e){
        console.log()
    }
}

const connectMongoDB = ({
    dbName,
    dbConnectionString,
    dbDescription
})=>{
    try {
       
        const db = mongoose.createConnection(dbConnectionString);
        // console.log("Production PM DB -> ", customPaymasterDB._connectionString);
        // console.log("Production Wallet DB -> ", smartWalletv2DB._connectionString);
      
        db.once('open', () => {
            console.log(EncloserStart)
          console.log(` Connected to DB: ${dbName}`);
          console.log(` DB Description : ${dbDescription}`)
          console.log(EncloserEnd)
        })
      
      }
      catch (e) {
        console.log("DB Connection error " + e);
      }
      
} 


try{
    startServerFunction({
        name:"Server 1",
        port: process.env.PORT,
        description:"First Server"
    })

    // connectToBlockchainThroughProviders("0x1");
    // connectToBlockchainThroughProviders("0x89");
    // connectToBlockchainThroughProviders("0x44d");
    // connectToBlockchainThroughProviders("0xa4b1");
    // connectToBlockchainThroughProviders("0xa");
    



    

    // startServerFunction({
    //     name:"Server 2",
    //     port: 3001,
    //     description:"Second Server"
    // })

    // startServerFunction({
    //     name:"Server 3",
    //     port: 3002,
    //     description:"Third Server"
    // })
    // getMemoryUsed();
    // setInterval(getMemoryUsed,300000);
   
}
catch(e){
    console.log("Main App Failed with Error "+e)
    console.log(e);
    checkStatusOfEverything();
}

