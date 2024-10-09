 //  curl https://api.openai.com/v1/models  -H "Authorization: Bearer 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"    -H "OpenAI-Organization: org-ffr5dAqr0sRHgkfQf0ApXO5z"    -H "OpenAI-Project: proj_jaRJVVn0Xe014TbWJ6vJJ4in"
const axios = require('axios');

const headers = {
    'Authorization': 'Bearer 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',
    // 'OpenAI-Organization':"org-ffr5dAqr0sRHgkfQf0ApXO5z",
    // 'OpenAI-Project': 'proj_jaRJVVn0Xe014TbWJ6vJJ4in'

}

const hitRequest = async ()=>{
    try{
        let data = await axios.get("https://api.openai.com/v1/models",{
            headers: headers
        })
        console.log(data.data);
    }
    catch(e){
        console.log(e);
        console.log("Error occired "+e);
    }
  
}
hitRequest();