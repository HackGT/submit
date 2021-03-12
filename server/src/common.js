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

const CURRENT_HACKATHON = process.env.CURRENT_HACKATHON || "HealthTech";
const ALL_PRIZES = config.hackathons[CURRENT_HACKATHON]
    ? [].concat(...Object.values(config.hackathons[CURRENT_HACKATHON])) : [];

const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://registration.2020.hack.gt/graphql';
const HACKGT_DEVPOST = process.env.DEVPOST_URL || "https://hackgt2020.devpost.com/";
const MEET_URL = process.env.MEET_URL || "https://meet.hack.gt";
const HOSTNAME = "healthtech-2021.devpost.com";

exports.config = config;

module.exports = {
    CURRENT_HACKATHON,
    ALL_PRIZES,
    GRAPHQL_URL,
    HACKGT_DEVPOST,
    MEET_URL,
    HOSTNAME
}