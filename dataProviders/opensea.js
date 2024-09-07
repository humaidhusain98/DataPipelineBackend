const axios = require('axios');

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY':process.env.OPENSEA_API_KEY
}

const retrieveListings = async(chain)=>{
    try{
        const resp  = await axios.get(`${process.env.OPENSEA_API_URL}/orders/${chain}/seaport/listings`,{
            headers: headers
        });

        console.log(resp.data);
        return resp.data;

    }
    catch(e){
        console.log(e);
    }
}

module.exports = {retrieveListings};

