let { Config } = require('../schema')
const express = require("express");

let configRoutes = express.Router();

configRoutes.route("/openSubmissions").post(async (req, res) => {
    if (!req.user.admin) {
        return res.send({error: true, message: "User is not an admin"});
    }

    const config = await Config.find({});
    if (config.length === 0) {
        try {
            return res.send(await Config.create({ submissionsOpen: true }));
        } catch (err) {
            console.error(err);
            return res.send({ error: true, message: err.message });
        }
    } else {
        try {
            return res.send(await Config.findOneAndUpdate({}, { submissionsOpen: true }, { new: true }));
        } catch (err) {
            console.error(err);
            return res.send({ error: true, message: err.message });
        }
    }
});

configRoutes.route("/closeSubmissions").post(async (req, res) => {
    if (!req.user.admin) {
        return res.send({error: true, message: "User is not an admin"});
    }

    const submissionsOpen = await Config.find({ submissionsOpen: true});
    if (submissionsOpen.length === 0) {
        return res.send({ error: false, message: "Submissions already closed" });
    }
    try {
        return res.send(await Config.findOneAndUpdate({}, { submissionsOpen: false }, { new: true }));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

configRoutes.route("/submissionStatus").get(async (req, res) => {
    const submissionsOpen = await Config.find({ submissionsOpen: true});
    if (submissionsOpen.length === 0) {
        return res.send({ submissionsOpen: false });
    }
    return res.send({ submissionsOpen: submissionsOpen[0].submissionsOpen });
});

exports.configRoutes = configRoutes;