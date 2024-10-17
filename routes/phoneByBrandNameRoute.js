const express = require('express');
const router = express.Router();
const PhoneCollections = require('../models/phoneCollectionSchema');

router.get('/phones/brand', async (req, res) => {
    const brand = req.query.brand;
    console.log('Fetching Phones....');

    try {
        let phones;

        if (brand) {
          
            console.log(`Fetching phones for brand: ${brand}`);
            phones = await PhoneCollections.find({ 
                brand: new RegExp(brand.replace(/_/g, ' '), 'i') 
            });

            if (phones.length === 0) {
                return res.status(404).json({ message: `No phones found for brand: ${brand}` });
            }
        } else {
            phones = await PhoneCollections.find();
        }

        console.log("Phones:", phones);
        res.status(200).json(phones);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching phones', error });
        console.error(error);
    }
});

module.exports = router;
