const { Submission } = require("../schema");
const express = require("express");
const dotenv = require("dotenv");
const { config } = require("../common");

dotenv.config();

const CURRENT_HACKATHON = process.env.CURRENT_HACKATHON || "HealthTech";
const allPrizes = config.hackathons[CURRENT_HACKATHON]
    ? [].concat(...Object.values(config.hackathons[CURRENT_HACKATHON])) : [];

let ballotRoutes = express.Router();

ballotRoutes.route("/export").get(async (req, res) => {
    try {
        const projects = await Submission.find({
            round: 'SUBMITTED'
        }).select('name devpost prizes meetingUrl projectId');
        return res.send({ error: false, projects, categories: allPrizes })
    } catch (err) {
        return res.send({ error: true, message: "Error: " + err })
    }
});

ballotRoutes.route("/exportAccepted").get(async (req, res) => {
    try {
        const projects = await Submission.find({
            round: 'ACCEPTED'
        }).select('name devpost prizes meetingUrl projectId expo');
        return res.send({ error: false, projects, categories: allPrizes })
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
