"use strict";

const app = require("./app.js");
const BASE_URL = "https://itunes.apple.com/us/app/app/id";
const common = require("./common.js");

function itunes(opts) {
  return new Promise(function (resolve, reject) {
    if (opts.id) {
      resolve(opts.id);
    } else if (opts.appId) {
      app(opts)
        .then((app) => resolve(app.id))
        .catch(reject);
    } else {
      throw Error("Either id or appId is required");
    }
  })
    .then((id) =>
      common.request(
        `${BASE_URL}${id}`,
        {
          "X-Apple-Store-Front": `${common.storeId(opts.country)},32`,
        },
        opts.requestOptions
      )
    )
    .then(function (text) {
      const regex = /its\.serverData=(.*?)<\/script>/s;
      const match = regex.exec(text);
      let jsonContent = null;
      if (match && match[1]) {
        jsonContent = match[1];
      }

      return jsonContent;
    });
}

module.exports = itunes;
