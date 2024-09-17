const PhoneCollections = require("../models/phoneCollectionSchema");

const addNewPhone = async() =>{
    let obj = new PhoneCollections({
        brand:"Samsung",
        model:"Galaxy S24 Ultra",
        price:58450,
        releaseDate:new Date('2024-17-09'),
        features:{
            screenSize: "6.8 inches",
            batteryLife: "5000mAh",
            cameraQuality: "200MP"
        },
        isStock:true
    });

    try {
        const savedPhone = await addNewPhone.save();
        console.log(savedPhone);
    } catch (error) {
        console.log('Error saving phone',error);
    }

}

const getAllPhoneCollection = async() =>{
    const phoneList = await PhoneCollections.find();
    console.log(phoneList);
}

const clearPhoneCollection = async() =>{
    const clearPhone = await PhoneCollections.deleteMany();
    console.log(clearPhone);
    
}
module.exports = {addNewPhone,getAllPhoneCollection,clearPhoneCollection};

