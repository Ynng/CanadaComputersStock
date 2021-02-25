const fetch = require("node-fetch");
if (!globalThis.fetch) globalThis.fetch = fetch;
const {
  id,
  product_info_url,
  product_web_url,
  RTX30_url,
} = require("./config.json");

let main = async () => {
    fetch(RTX30_url);
};
main();

// fetch(product_info_url+"083780");
