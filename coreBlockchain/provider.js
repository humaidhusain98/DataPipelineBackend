const { ethers,JsonRpcProvider } = require("ethers");
const { EncloserStart, EncloserEnd } = require("../helpers/constants");

const connectProvider = async({providerUrl,chainDetails})=>{
    try{
        const provider = new JsonRpcProvider(providerUrl);
        const blockNumber = await provider.getBlockNumber();
        console.log(EncloserStart)
        console.log(`Latest Block Number of ${chainDetails.name} is ${blockNumber}`);
        console.log(EncloserEnd);
        return provider;
    }   
    catch(e){
        console.log("Error Occured while connecting provider "+e);
        return null;
    } 
}




module.exports={connectProvider};
