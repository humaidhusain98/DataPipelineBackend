const mongoose = require('mongoose');
const db = mongoose.createConnection(process.env.MONGODB_URL_DB1 + "trikonMarketplace");

const phoneCollectionSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    image:{
        type:String,
        required:true,
    },
    price: {
        type: Number,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    features: {
        screenSize: {
            type: String,
            required: true,
        },
        batteryLife: {
            type: String,
        },
        cameraQuality: {
            type: String,
        }
    },
    inStock: {
        type: Boolean,
        default: true,
    }
});

const PhoneCollections = db.model('PhoneCollections', phoneCollectionSchema);
module.exports = PhoneCollections;
