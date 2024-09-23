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
    await page.goto("https://www.gsmarena.com/oppo_f27-13270.php",{
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

    const imageUrl = await page.$eval('.specs-photo-main img', img => img.src);
    console.log("Image URL:", imageUrl);

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

    const bodyFeatures = await page.$$eval('#specs-list table', tables => {
        let body = {
            dimensions: null,
            weight: null,
            build: null,
            sim: null
        };

        tables.forEach(table => {
            const header = table.querySelector('th')?.textContent.trim();
            if (header && header.includes('Body')) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const key = row.querySelector('.ttl')?.textContent.trim();
                    const value = row.querySelector('.nfo')?.textContent.trim();

                    if (key && value) {
                        if (key.includes('Dimensions')) body.dimensions = value;
                        if (key.includes('Weight')) body.weight = value;
                        if (key.includes('Build')) body.build = value;
                        if (key.includes('SIM')) body.sim = value;
                    }
                });
            }
        });

        return body;
    });

    console.log("Body Features Scraped: ", bodyFeatures);

     const displayFeatures = await page.$$eval('#specs-list table', tables => {
        let display = {
            type: null,
            size: null,
            resolution: null,
            protection: null
        };

        tables.forEach(table => {
            const header = table.querySelector('th')?.textContent.trim();
            if (header && header.includes('Display')) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const key = row.querySelector('.ttl')?.textContent.trim();
                    const value = row.querySelector('.nfo')?.textContent.trim();

                    if (key && value) {
                        if (key.includes('Type')) display.type = value;
                        if (key.includes('Size')) display.size = value;
                        if (key.includes('Resolution')) display.resolution = value;
                        if (key.includes('Protection')) display.protection = value;
                    }
                });
            }
        });

        return display;
    });

    console.log("Display Features:",displayFeatures);

    
    const platformFeatures = await page.$$eval('#specs-list table', tables => {
        let platform = {
            os: null,
            chipset: null,
            cpu: null,
            gpu: null
        };

        tables.forEach(table => {
            const header = table.querySelector('th')?.textContent.trim();
            if (header && header.includes('Platform')) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const key = row.querySelector('.ttl')?.textContent.trim();
                    const value = row.querySelector('.nfo')?.textContent.trim();

                    if (key && value) {
                        if (key.includes('OS')) platform.os = value;
                        if (key.includes('Chipset')) platform.chipset = value;
                        if (key.includes('CPU')) platform.cpu = value;
                        if (key.includes('GPU')) platform.gpu = value;
                    }
                });
            }
        });

        return platform;
    });

    console.log("Platform Features:",platformFeatures);

    const memoryFeatures = await page.$$eval('#specs-list table', tables => {
        let memory = {
            internal: null,
            external: null
        };

        tables.forEach(table => {
            const header = table.querySelector('th')?.textContent.trim();
            if (header && header.includes('Memory')) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const key = row.querySelector('.ttl')?.textContent.trim();
                    const value = row.querySelector('.nfo')?.textContent.trim();

                    if (key && value) {
                        if (key.includes('Internal')) memory.internal = value;
                        if (key.includes('External')) memory.external = value;
                    }
                });
            }
        });

        return memory;
    });

    console.log("Memory Features:",memoryFeatures);
   
   const cameraFeatures = await page.$$eval('#specs-list table', tables => {
    let camera = {
        main: {
            type: null,
            features: null,
            video: null
        },
        selfie: {
            type: null,
            features: null,
            video: null
        }
    };

    tables.forEach(table => {
        const header = table.querySelector('th')?.textContent.trim();
        if (header && header.includes('Camera')) {
            const rows = table.querySelectorAll('tr');
            let isMainCamera = header.includes('Main Camera');
            let isSelfieCamera = header.includes('Selfie Camera');

            rows.forEach(row => {
                const key = row.querySelector('.ttl')?.textContent.trim();
                const value = row.querySelector('.nfo')?.textContent.trim();

                if (key && value) {
                    if (isMainCamera) {
                        if (key.includes('Type')) camera.main.type = value;
                        if (key.includes('Features')) camera.main.features = value;
                        if (key.includes('Video')) camera.main.video = value;
                    }

                    if (isSelfieCamera) {
                        if (key.includes('Type')) camera.selfie.type = value;
                        if (key.includes('Features')) camera.selfie.features = value;
                        if (key.includes('Video')) camera.selfie.video = value;
                    }
                }
            });
        }
    });

    return camera;
});

    
    console.log("Camera Features:",cameraFeatures);

  const batteryFeatures = await page.$$eval('#specs-list table', tables => {
    let battery = {
        type: null,
        capacity: null,
        charging: null
    };

    tables.forEach(table => {
        const header = table.querySelector('th')?.textContent.trim();
        if (header && header.includes('Battery')) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const key = row.querySelector('.ttl')?.textContent.trim();
                const value = row.querySelector('.nfo')?.textContent.trim();

                if (key && value) {
                    if (key.includes('Type')) battery.type = value;
                    if (key.includes('Capacity')) battery.capacity = value;
                    if (key.includes('Charging')) battery.charging = value;
                }
            });
        }
    });

    return battery;
});

console.log("Battery Features:", batteryFeatures);

    console.log(`\n\n===================== Phone Specifications =====================`);
    console.log(`Brand: ${brand.trim()}`);
    console.log(`Model: ${phoneModel}`);
    console.log(`Price: $${price}`);
    console.log(`Release Date: ${releaseDate.toDateString()}`);
    console.log(`Image URL: ${imageUrl || "N/A"}`);
    

    console.log(`\n-------- Specifications --------`);
    cleanedData.forEach(spec => {
        console.log(`- ${spec}`);
    });

    console.log(`\n===============================================================\n\n`);

    const newPhone = new Phone({
        brand: brand.trim(),
        model: phoneModel,
        image: imageUrl || "N/A",
        price: price,
        releaseDate: releaseDate,
        body: {
            dimensions: bodyFeatures.dimensions,
            weight: bodyFeatures.weight,
            build: bodyFeatures.build,
            sim: bodyFeatures.sim
        },
        display: {
            type: displayFeatures.type,
            size: displayFeatures.size,
            resolution: displayFeatures.resolution,
            protection: displayFeatures.protection
        },
        platform: {
            os: platformFeatures.os,
            chipset: platformFeatures.chipset,
            cpu: platformFeatures.cpu,
            gpu: platformFeatures.gpu
        },
        memory: {
            internal: memoryFeatures.internal,
            external: memoryFeatures.external
        },
        camera: {
            main: {
                type: cameraFeatures.main.type,
                features: cameraFeatures.main.features,
                video: cameraFeatures.main.video
            },
            selfie: {
                type: cameraFeatures.selfie.type,
                features: cameraFeatures.selfie.features,
                video: cameraFeatures.selfie.video
            }
        },
        battery: {
            type: batteryFeatures.type,
            capacity: batteryFeatures.capacity,
            charging: batteryFeatures.charging
        },
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

screenshotPage('oppo_f27');

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