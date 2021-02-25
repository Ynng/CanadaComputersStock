const fetch = require("node-fetch");
const beep = require("beepbeep");
const domparser = new DOMParser();
if (!globalThis.fetch) globalThis.fetch = fetch;
const {
  id,
  product_info_url,
  product_web_url,
  RTX30_url,
} = require("./config.json");

let checkStock = async (cc_url) => {
  await fetch(cc_url).then((response) => {
    if (response.ok) return response.text();
    throw response;
  }).then((text)=>{
    const doc = domparser.parseFromString(text);
    
  })
}

let handleData = async (text) => {
  let json = JSON.parse(text);
  let obj = JSON.parse(json);
  let cards = obj.searchedProducts.productDetails;

  cards.forEach((item, idx) => {
    await checkStock(item.productUrl);
  });
};

let main = async () => {
  fetch(RTX30_url)
    .then((response) => {
      if (response.ok) return response.text();
      throw response;
    })
    .then((text) => {
      handleData(text);
    });
};
main();
