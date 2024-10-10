const express = require('express');
const router = express.Router();
const PhoneCollections = require('../models/phoneCollectionSchema');

router.get('/phones', async (req, res) => {
    console.log('Fetching Phones....');
    
    try {
        const phones = await PhoneCollections.find();
        console.log("Phones:",phones);
        res.status(200).json(phones);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching phones', error });
        console.log(error);
    }
});

module.exports = router;
