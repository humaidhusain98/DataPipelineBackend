const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Phone = require('../models/phoneCollectionSchema');


require('dotenv').config();

const mongoURI1 = process.env.MONGODB_URL_DB1+"trikonMarketplace";

const connectToDatabase = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectToDatabase(mongoURI1);


function breakOnTab (string) {
    var reg = new RegExp(/(\r\n?|\n|\t)/g);
    return string.replace(reg, "-")
}

 const screenshotPage = async (phoneModel) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "../temp"
    });

    const page = await browser.newPage();
    await page.goto("https://www.gsmarena.com/samsung_galaxy_f05-13345.php",{
        timeout: 60000,  
        waitUntil: 'domcontentloaded'
    });

    const f = await page.$("#specs-list");
    const phoneSpecificationsReturned = await (await f.getProperty('textContent')).jsonValue();

    const cleanedData = phoneSpecificationsReturned
        .split("\n")
        .map(line => line.trim())
        .filter(line => line && line.length > 0)
        .map(line => breakOnTab(line));

    const brand = await page.$eval('.specs-phone-name-title', el => el.textContent);
    const imageExists = await page.$('.specs-photo img');
    let image = null;

    if (imageExists) {
        image = await page.$eval('.specs-photo img', el => el.src);
    }

    const price = 299; 
    const releaseDate = new Date(); 

     const networkFeatures = await page.$$eval('#specs-list table', tables => {
        let network = {
            technology: null,
            bands: {
                _2g: null,
                _3g: null,
                _4g: null,
                _5g: null
            },
            speed: null
        };

        tables.forEach(table => {
            const header = table.querySelector('th')?.textContent.trim();
            if (header && header.includes('Network')) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const key = row.querySelector('.ttl')?.textContent.trim();
                    const value = row.querySelector('.nfo')?.textContent.trim();

                    if (key && value) {
                        if (key.includes('Technology')) network.technology = value;
                        if (key.includes('2G bands')) network.bands._2g = value;
                        if (key.includes('3G bands')) network.bands._3g = value;
                        if (key.includes('4G bands')) network.bands._4g = value;
                        if (key.includes('5G bands')) network.bands._5g = value;
                        if (key.includes('Speed')) network.speed = value;
                    }
                });
            }
        });

        return network;
    });

    console.log("Network Features Scraped: ", networkFeatures);


    console.log(`\n\n===================== Phone Specifications =====================`);
    console.log(`Brand: ${brand.trim()}`);
    console.log(`Model: ${phoneModel}`);
    console.log(`Price: $${price}`);
    console.log(`Release Date: ${releaseDate.toDateString()}`);
    console.log(`Image URL: ${image || "N/A"}`);
    

    console.log(`\n-------- Specifications --------`);
    cleanedData.forEach(spec => {
        console.log(`- ${spec}`);
    });

    console.log(`\n===============================================================\n\n`);

    const newPhone = new Phone({
        brand: brand.trim(),
        model: phoneModel,
        image: image || "N/A",
        price: price,
        releaseDate: releaseDate,
        network: networkFeatures,
        specifications: cleanedData,
    });

    await newPhone.save()
        .then(() => console.log('Phone data saved to MongoDB!'))
        .catch(err => console.error('Error saving phone data:', err));

    await browser.close();
    mongoose.connection.close();
};



    // const newString = breakOnTab(phoneSpecificationsReturned);
    // console.log(newString);
    // let splitPhoneSpecifications = phoneSpecificationsReturned.split("\n");
    // let newList = [];
    // let count =0;
    // for(let char of splitPhoneSpecifications){
    //     if((char =='') || (char=='  ') || (char=='   ') || (char=='\t\t\t') || (char=='\t') || (char=='\t') || (char=='\t\t') || (char==' \t') ||  (count==0) || ( count==1) ||(char ==' ')){
        
    //     }
    //     else{
    //         newList.push(char);
    //     }
    //     count = count + 1;
     

    // }
    // console.log(newList);

    
    // f.type("Puppeteer")
    // console.log(f);
    //wait for sometime
    // await page.waitForTimeout(4000)

screenshotPage('galaxy_f05');

module.exports = screenshotPage;

// const puppeteer = require('puppeteer');

// const main = async() =>{
//     const browser = await puppeteer.launch({headless:false});
//     const page = await browser.newPage();
//     await page.goto("https://www.gsmarena.com/apple_iphone_16_pro_max-13123.php", {
//         waitUntil: 'domcontentloaded'
//     });

//     const phoneName = await page.$eval('.specs-phone-name-title', el => el.textContent.trim());

//     // Extract image URL
//     const phoneImage = await page.$eval('.specs-photo-main img', el => el.src);

//     // Extract specifications list (screen size, battery, camera, etc.)
//     let rawSpecifications = await page.$$eval('#specs-list table tr', rows => {
//         return rows.map(row => {
//             const category = row.querySelector('td.ttl')?.textContent.trim();
//             const value = row.querySelector('td.nfo')?.textContent.trim();
//             return category && value ? { category, value } : null;
//         }).filter(Boolean);
//     });

//     let cleanedSpecifications = rawSpecifications.map(spec => {
//         // Normalize strings (remove tabs, newlines, etc.)
//         return {
//             category: spec.category.replace(/\s+/g, ' ').trim(),
//             value: spec.value.replace(/\s+/g, ' ').trim()
//         };
//     });

//     cleanedSpecifications = cleanedSpecifications.filter(spec => spec.value.toLowerCase() !== 'no' && spec.value.toLowerCase() !== 'n/a');

//     // Optional: Format the output for better readability
//     const formattedSpecifications = cleanedSpecifications.reduce((acc, spec) => {
//         return acc + `${spec.category}: ${spec.value}\n`;
//     }, '');

//     // Log the scraped data
//     console.log("Phone Name:", phoneName);
//     console.log("Phone Image URL:", phoneImage);
//     console.log("Cleaned and Formatted Specifications:\n", formattedSpecifications);

//     await browser.close();
// };

// main();