const fetch = require("node-fetch");
if (!globalThis.fetch) globalThis.fetch = fetch;
const { id, product_info_url, product_web_url, RTX30_url } = require("./config.json");


fetch(RTX30_url)
// fetch(product_info_url+"083780");
