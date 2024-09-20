const express = require("express");
const router = express.Router();
const Phone = require("../models/phoneCollectionSchema");
const screenshotPage = require("../dataProviders/puppeteer");

router.get('/scrape',async(req,res) =>{
    try {
        const phoneModel = 'galaxy_f05';
        await screenshotPage(phoneModel);
        res.status(200).send(`Scraping completed for ${phoneModel}`);
    } catch (error) {
        console.log(err);
        res.send(500).send('Error occurred while scraping');
    }
});

router.get('/phones', async (req, res) => {
    try {
        const phones = await Phone.find();
        res.status(200).json(phones);  
    } catch (err) {
        res.status(500).send('Error retrieving phone data from database');
    }
});

module.exports = router;