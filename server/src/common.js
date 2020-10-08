const path = require("path");
const fs = require("fs");

let config = undefined;

try {
    config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./config/config.json"), "utf8"));
} catch (err) {
    if (err.code !== "ENOENT") {
        throw err;
    }
}

exports.config = config;