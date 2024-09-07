const chainsList ={
    "0x1":{name:"Ethereum Mainnet", chainId:"0x1", providerUrl: process.env.PROVIDER_ETH_MAINNET_URL,isMainnet: true, currency: "ETH"},
    "0x89":{name:"Polygon Mainnet", chainId:"0x89", providerUrl: process.env.PROVIDER_POLYGON_POS_MAINNET_URL,isMainnet: true, currency: "POL"},
    "0x44d":{name:"Polygon zkEVM", chainId:"0x44d", providerUrl: process.env.PROVIDER_POLYGON_zKEVM_MAINNET_URL, isMainnet: true, currency: "ETH"},
    "0xa4b1":{name:"Arbitrum One Mainnet", chainId:"0xa4b1", providerUrl: process.env.PROVIDER_ARBITRUM_MAINNET_URL,isMainnet: true, currency: "ETH"},
    "0xa4ba":{name:"Arbitrum Nova", chainId:"0xa4ba", providerUrl: process.env.PROVIDER_ARBITRUM_NOVA_MAINNET_URL,isMainnet: true, currency: "ETH"},
    "0x144":{name:"zkSync Mainnet", chainId:"0x144", providerUrl: process.env.PROVIDER_ZKSYNC_MAINNET_URL,isMainnet: true, currency: "ETH"},
    "0xa":{name:"Optimism Mainnet", chainId:"0xa", providerUrl: process.env.PROVIDER_OPTIMISM_MAINNET_URL,isMainnet: true, currency: "ETH"},
    // "0x1":{name:"Starknet Mainnet", chainId:"0x1", providerUrl: process.env.PROVIDER_STARKNET_MAINNET_URL,isMainnet: true, currency: "ETH"},
    // "0x1":{name:"Ethereum Mainnet", chainId:"0x1", providerUrl: process.env.PROVIDER_ETH_MAINNET_URL,isMainnet: true, currency: "ETH"},
    // "0x1":{name:"Ethereum Mainnet", chainId:"0x1", providerUrl: process.env.PROVIDER_ETH_MAINNET_URL,isMainnet: true, currency: "ETH"},
    // "0x1":{name:"Ethereum Mainnet", chainId:"0x1", providerUrl: process.env.PROVIDER_ETH_MAINNET_URL,isMainnet: true, currency: "ETH"},
    // "0x1":{name:"Ethereum Mainnet", chainId:"0x1", providerUrl: process.env.PROVIDER_ETH_MAINNET_URL,isMainnet: true, currency: "ETH"},
    // "0x1":{name:"Ethereum Mainnet", chainId:"0x1", providerUrl: process.env.PROVIDER_ETH_MAINNET_URL,isMainnet: true, currency: "ETH"},
}

const getChainDetailsByChainId = (chainId)=>{
    try{
       return chainsList[chainId];
    }
    catch(e){
        console.log("getChainDetailsError "+e);
    }
}


module.exports={
    chainsList,
    getChainDetailsByChainId
}