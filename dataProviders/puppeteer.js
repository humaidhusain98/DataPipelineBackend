const puppeteer = require('puppeteer');

function breakOnTab (string) {
    var reg = new RegExp(/(\r\n?|\n|\t)/g);
    return string.replace(reg, "-")
}

const screenshotPage = async()=>{
    const browser = await puppeteer.launch(
        {
            headless: false,
            defaultViewport: false,
            userDataDir:"../temp"
        }
    );
    const page = await browser.newPage();
    await page.goto("https://www.gsmarena.com/oppo_f27-13270.php");
    await page.screenshot({path: "../screenshot/gsma1.png"})
    const f = await page.$("#specs-list");
    const phoneSpecificationsReturned = await (await f.getProperty('textContent')).jsonValue()
    const newString = breakOnTab(phoneSpecificationsReturned);
    console.log(newString);
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
 

    
}

// screenshotPage();