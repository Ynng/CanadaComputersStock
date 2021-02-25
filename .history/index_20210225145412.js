const fetch = require("node-fetch");
if (!globalThis.fetch) globalThis.fetch = fetch;
const {
  id,
  product_info_url,
  product_web_url,
  RTX30_url,
} = require("./config.json");

let main = async () => {
  console.log(RTX30_url);
  fetch(RTX30_url).then((respnse)=>{
    if (response.ok) return JSON.parse(response.text());
    throw response;
  }).then((data)=>{
    console.log(data);
  })
  console.log("Test");
};
main();

// fetch(product_info_url+"083780");
