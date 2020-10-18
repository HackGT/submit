const { User, Submission } = require("../schema");
const express = require("express");
const axios = require("axios");
const rp = require("request-promise");
const { DateTime } = require("luxon");
const dotenv = require("dotenv");
const { config } = require("../common");

const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://registration.2020.hack.gt/graphql';
const CURRENT_HACKATHON = "HackGT 7";
const HACKGT_DEVPOST = "https://hackgt2020.devpost.com/";
let ballotRoutes = express.Router();

var isAuth = (req) => {
    const auth = req.headers.authorization;
	if (auth && typeof auth === "string" && auth.includes(" ")) {
		const key = auth.split(" ")[1].toString();
		if (key === process.env.SUBMIT_SECRET || env.DEV_MODE === "True") {
            return {error: false}
		}
		else {
            return {error: true, message: "Incorrect auth token"}
		}
	}
	else {
		if(env.DEV_MODE === "True") {
			return {error: false}
		} else {
			return {error: true, message: "No auth token"}
		}
	}
}
ballotRoutes.route("/export").get(async (req,res) => {

    const round = req.params.round
    try {
        const projects = await Submission.find({
            round: 'SUBMITTED'
        }).select('name devpost prizes wherebyRoom projectId');

        const categories = config.hackathons["HackGT 7"].emergingPrizes.concat(config.hackathons["HackGT 7"].sponsorPrizes);

        return res.send({error: false, projects: projects, categories: categories})
    } catch(err) {
        return res.send({error: true, message: "Error: " + err})
    }
})

ballotRoutes.route("/exportAccepted").get(async (req,res) => {

    const round = req.params.round
    try {
        const projects = await Submission.find({
            round: 'ACCEPTED'
        }).select('name devpost prizes wherebyRoom projectId expo');

        const categories = config.hackathons["HackGT 7"].emergingPrizes.concat(config.hackathons["HackGT 7"].sponsorPrizes);

        return res.send({error: false, projects: projects, categories: categories})
    } catch(err) {
        return res.send({error: true, message: "Error: " + err})
    }
})

ballotRoutes.route("/accept-projects").post(async (req,res) => {
    const projects = req.body.projects;
    try {
        if(projects) {
            projects.forEach(async project => {
                await Submission.updateOne({
                    "projectId": project.projectId
                }, {
                    "round": "ACCEPTED",
                    "expo" : project.expoNumber
                });
            })
            return res.send({error: false})
        } else {
            return res.send({error: true, message: "projects not specified"})
        }
    } catch(err) {
        console.log(err);
        return res.send({error: true, message: "Error: " + err})
    }
})

exports.ballotRoutes = ballotRoutes;
