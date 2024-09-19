const axios = require('axios');
const fs = require('fs');

const headers = {
    'Content-Type': 'application/json',
    'x-rapidapi-host': 'mobile-phone-specs-database.p.rapidapi.com',
    'x-rapidapi-key': '53801af372msh27b9ebaee9ccc07p1c5ecejsn5148200f3df4'
}

const getMobileBrands = async ()=>{
    try{
     const resp = await axios.get("https://mobile-phone-specs-database.p.rapidapi.com/gsm/all-brands",{
        headers: headers
     })
     console.log(resp.data);
     let json = JSON.stringify(resp.data);
    //  fs.writeFile('mobileBrands.json', json,(err,success)=>{
    //     console.log("Error "+err);
    //     console.log("Success " + success);
    // });
    }
    catch(e){
        console.log("Error occured "+e);
        // console.log(e.response.data);
    }
}


const getAllModelsByBrand = async (brand)=>{
    try{
     const resp = await axios.get("https://mobile-phone-specs-database.p.rapidapi.com/gsm/get-models-by-brandname/"+brand,{
        headers: headers
     })
     console.log(resp.data);
     let json = JSON.stringify(resp.data);
     return json;
    //  fs.writeFile('mobileBrands.json', json,(err,success)=>{
    //     console.log("Error "+err);
    //     console.log("Success " + success);
    // });
    }
    catch(e){
        console.log("Error occured "+e);
        // console.log(e.response.data);
    }
}

const getDetailsByBrandandModal = async (brandName,modelValue)=>{
    try{
     const resp = await axios.get("https://mobile-phone-specs-database.p.rapidapi.com/gsm/get-specifications-by-brandname-modelname/"+brandName+"/"+modelValue,{
        headers: headers
     })
     console.log(resp.data);
     let json = JSON.stringify(resp.data);
     return json;
    //  fs.writeFile('mobileBrands.json', json,(err,success)=>{
    //     console.log("Error "+err);
    //     console.log("Success " + success);
    // });
    }
    catch(e){
        console.log("Error occured "+e);
        // console.log(e.response.data);
    }
}

const readFromJSONFile = async(fileName)=>{
    try{
        let objList = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        // let objList=[
        //     {modelValue:"iPad Pro 12.9 (2022)"}];
        for(let model of objList){
            let json =await getDetailsByBrandandModal("Apple",model.modelValue);
              fs.writeFile("./mobileSpecificData/"+"Apple"+"-"+model.modelValue+".json", json,(err,success)=>{
        console.log("Error "+err);
        console.log("Success " + success);
    });
        }
  
    }
    catch(e){
        console.log("Error reading json file")
    }
}


readFromJSONFile("./mobileData/Apple.json")