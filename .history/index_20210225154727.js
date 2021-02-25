const fetch = require("node-fetch");
const beep = require("beepbeep");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
if (!globalThis.fetch) globalThis.fetch = fetch;
const {
  id,
  product_info_url,
  product_web_url,
  RTX30_url,
} = require("./config.json");

let checkStock = async (cc_url) => {
  let output = false;
  await fetch(cc_url)
    .then((response) => {
      if (response.ok) return response.text();
      throw response;
    })
    .then((text) => {
      const { document } = new JSDOM(text).window;
      let stocklevel = document.querySelector(".stocklevel-pop");
      let stocklevels = Array.from(stocklevel.children);
      stocklevels.shift();
      stocklevels.pop();
      stocklevels.forEach((row) => {
        let locations = Array.from(row.children);
        locations.forEach((location) => {
          let row = location.children[0];
          if (row.tagName !== "DIV") return;
          let name = row.children[0].children[0].children[0].textContent;
          let stock =
            row.children[1].children[0].children[0].children[0].children[0]
              .textContent;
          if (stock != "-") {
            output = true;
            console.log(`${name}: ${stock}`);
          }
        });
      });
    });
};

let handleData = async (text) => {
  let json = JSON.parse(text);
  let obj = JSON.parse(json);
  let cards = obj.searchedProducts.productDetails;

  let i = 0;
  cards.forEach(async (item, idx) => {
    i++;
    if (i > 2) return;
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
