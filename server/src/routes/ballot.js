const { User, Submission } = require("../schema");
const express = require("express");
const axios = require("axios");
const rp = require("request-promise");
const { DateTime } = require("luxon");
const dotenv = require("dotenv");
const { config } = require("../common");

let ballotRoutes = express.Router();

ballotRoutes.route("/export").get(async (req, res) => {
    try {
        const projects = await Submission.find({
            round: 'SUBMITTED'
        }).select('name devpost prizes wherebyRoom projectId');

        const categories = config.hackathons["HackGT 7"].emergingPrizes.concat(config.hackathons["HackGT 7"].sponsorPrizes);

        return res.send({ error: false, projects: projects, categories: categories })
    } catch (err) {
        return res.send({ error: true, message: "Error: " + err })
    }
});

ballotRoutes.route("/exportAccepted").get(async (req, res) => {
    try {
        const projects = await Submission.find({
            round: 'ACCEPTED'
        }).select('name devpost prizes wherebyRoom projectId expo');

        const categories = config.hackathons["HackGT 7"].emergingPrizes.concat(config.hackathons["HackGT 7"].sponsorPrizes);

        return res.send({ error: false, projects: projects, categories: categories })
    } catch (err) {
        return res.send({ error: true, message: "Error: " + err })
    }
});

ballotRoutes.route("/accept-projects").post(async (req, res) => {
    const projects = req.body.projects;
    try {
        if (projects) {
            projects.forEach(async project => {
                await Submission.updateOne({
                    "projectId": project.projectId
                }, {
                    "round": "ACCEPTED",
                    "expo": project.expoNumber
                });
            })
            return res.send({ error: false })
        } else {
            return res.send({ error: true, message: "Projects not specified" })
        }
    } catch (err) {
        console.log(err);
        return res.send({ error: true, message: "Error: " + err })
    }
});

exports.ballotRoutes = ballotRoutes;
