let { Video, Submission } = require('../schema')
const fetch = require('node-fetch');
const express = require("express");

let videoRoutes = express.Router();
const MEET_URL = process.env.MEET_URL || "https://meet.hack.gt";

videoRoutes.route("/activateVideos").post(async (req, res) => {
    if (!req.user.admin) {
        return res.send({error: true, message: "User is not an admin"});
    }

    const video = await Video.find({});
    if (video.length === 0) {
        try {
            return res.send(await Video.create({ isActive: true }));
        } catch (err) {
            console.error(err);
            return res.send({ error: true, message: err.message });
        }
    } else {
        try {
            return res.send(await Video.findOneAndUpdate({}, { isActive: true }, { new: true }));
        } catch (err) {
            console.error(err);
            return res.send({ error: true, message: err.message });
        }
    }
});

videoRoutes.route("/closeVideos").post(async (req, res) => {
    if (!req.user.admin) {
        return res.send({error: true, message: "User is not an admin"});
    }

    const videosActive = await Video.find({ isActive: true});
    if (videosActive.length === 0) {
        return res.send({ error: false, message: "Videos closed" });
    }
    try {
        return res.send(await Video.findOneAndUpdate({}, { isActive: false }, { new: true }));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

videoRoutes.route("/videoStatus").get(async (req, res) => {
    const videosActive = await Video.find({ isActive: true});
    if (videosActive.length === 0) {
        return res.send({ isActive: false });
    }
    return res.send({ isActive: videosActive[0].isActive });
});

videoRoutes.route("/validateRoomName/:name").get(async (req, res) => {
    try {
        const projects = await Submission.find({
            name: req.params.name,
            round: 'ACCEPTED'
        }).select('name');
        const videosActive = await Video.find({ isActive: true});

        if (projects.length > 0 && videosActive.length > 0 && videosActive[0].isActive) {
            return res.send({ error: false, valid: true })
        } else {
            return res.send({ error: false, valid: false })
        }
    } catch (err) {
        return res.send({ error: true, message: "Error: " + err })
    }
});

videoRoutes.route("/endCalls").post(async (req, res) => {
    try {
        const endCalls = await fetch(MEET_URL + '/endCalls',
            {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + process.env.SUBMIT_SECRET,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
        return res.send(endCalls);
    } catch (err) {
        return res.send({ error: true, message: "Error: " + err })
    }
});

exports.videoRoutes = videoRoutes;
