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
  fetch(RTX30_url).then()
  console.log(response.text());
  console.log("Test");
};
main();

// fetch(product_info_url+"083780");
