const express = require('express');
const router = express.Router();
const TopCollections = require('../models/topCollectionsSchema');

router.get('/topCollections/:rankDeterminingType', async (req, res) => {
    try {
        const { rankDeterminingType } = req.params;

        const Collections = await TopCollections.find({ rank_determiningType: rankDeterminingType });

        if (Collections.length === 0) {
            return res.status(404).json({ message: `No collections found for rankDeterminingType: ${rankDeterminingType}` });
        }

        console.log(`Fetched collections for rank_determiningType: ${rankDeterminingType}`);
        console.dir(Collections, { depth: null });

        res.status(200).json(Collections);
    } catch (error) {
        console.log('Error while fetching top Collections data:', error);
        res.status(500).json({ message: 'Error fetching top collections data' });
    }
});

module.exports = router;
