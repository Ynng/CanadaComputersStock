const fetch = require("node-fetch");
const beep = require("beepbeep");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
if (!globalThis.fetch) globalThis.fetch = fetch;
const { search_url, RTX30_url } = require("./config.json");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let randomRange = (min, max) => {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
};

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
      if (!stocklevel) {
        console.log("Failed");
        return;
      }
      let stocklevels = Array.from(stocklevel.children);
      stocklevels.shift();
      stocklevels.pop();
      stocklevels.forEach((row) => {
        let locations = Array.from(row.children);
        locations.forEach((location) => {
          let row = location.children[0];
          if (row.tagName !== "DIV") return;
          let name = row.children[0].children[0].textContent;
          if (name.length < 1) return;
          let stock = row.children[1].children[0].children[0].textContent.trim();
          if (stock != "-") {
            output = true;
            console.log(`${name}: ${stock}`);
          }
        });
      });
    });
  await sleep(randomRange(7, 15) * 1000);
  return output;
};

let handleRTXdata = async (text) => {
  let json = JSON.parse(text);
  let obj = JSON.parse(json);
  let cards = obj.searchedProducts.productDetails;

  for (let i = 0; i < cards.length; i++) {
    let item = cards[i];
    let stock = await checkStock(item.productUrl);
    console.log(
      `%c${item.productTitle} - ${item.productUrl}`,
      `color: ${stock ? "green" : "white"}`
    );
    beep(1);
  }
};

let handleSearchData = async (text) => {
  const { document } = new JSDOM(text).window;
  let titles = document.querySelectorAll(".productTemplate_title");
  if (!titles) {
    console.log("Failed");
    return;
  }
  let titlesArr = Array.from(titles);
  for (let i = 0; i < titlesArr.length; i++) {
    let title = titlesArr[i];
    let link = title.children[0];
    let name = link.textContent;
    let url = link.href;
    let stock = await checkStock(url);
    if (stock) {
      console.log(`%c${name} - ${url}`, `color: ${stock ? "green" : "white"}`);
      beep(1);
    }
  }
};

let main = async () => {
  // fetch(RTX30_url)
  //   .then((response) => {
  //     if (response.ok) return response.text();
  //     throw response;
  //   })
  //   .then((text) => {
  //     handleRTXdata(text);
  //   });
  while (true) {
    let pageNum = 1;
    let now = new Date();
    console.log(`${now.toISOString()}`);
    while (true) {
      console.log(`page ${pageNum}`);

      let response = await fetch(`${search_url}&page=${pageNum}`, {
        compress: false,
      });
      if (!response.ok) throw response;
      let text = await response.text();

      if (text.length < 1000) console.log(text);

      if (text.length < 200) break;
      await handleSearchData(text);
      pageNum++;
    }
    await sleep(randomRange(50, 180) * 1000);
  }
};
main();
