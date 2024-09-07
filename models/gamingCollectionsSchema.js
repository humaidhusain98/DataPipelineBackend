const mongoose = require('mongoose');
const db = mongoose.createConnection(process.env.MONGODB_URL_DB1+"trikonMarketplace");
const gamingCollectionsSchema = new mongoose.Schema({
    contractAddress:{
        type: String,
        required: true
    },
    blockSpanKey:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    chain:{
        type: String,
        required: true
    }

})

module.exports= GamingCollections = db.model('gamingCollections',gamingCollectionsSchema);
