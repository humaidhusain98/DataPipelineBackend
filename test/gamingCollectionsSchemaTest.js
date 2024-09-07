const GamingCollections = require('../models/gamingCollectionsSchema');

const addNewGamingCollection = async()=>{
    let obj = new GamingCollections({
        contractAddress:"3dfdsf54ydrgdfgdrgdf",
        blockSpanKey:"test",
        name:"test",
        chain:"eth-main"
    });
    await obj.save();
    console.log(obj);
}

const getAllGamingCollection = async()=>{
    const objectlist = await GamingCollections.find();
    console.log(objectlist);
}

const clearGamingCollection = async()=>{
    const clearResp = await  GamingCollections.deleteMany();
    console.log(clearResp);
}


module.exports={addNewGamingCollection,getAllGamingCollection,clearGamingCollection};