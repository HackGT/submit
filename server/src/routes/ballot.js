const { User, Submission } = require("../schema");
const express = require("express");
const axios = require("axios");
const rp = require("request-promise");
const { DateTime } = require("luxon");
const dotenv = require("dotenv");

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
        }).select('name devpost prizes wherebyRoom projectId')
        console.log(projects)
        return res.send({error: false, projects: projects})
    } catch(err) {
        return res.send({error: true, message: "Error: " + err})
    }
})

ballotRoutes.route("/accept-projects").post(async (req,res) => {
    const projectIds = req.body.projectIds;
    try {
        if(projectIds) {
            await Submission.updateMany({"projectId": {"$in": projectIds}},{"$set": {"round":"ACCEPTED"}});
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
