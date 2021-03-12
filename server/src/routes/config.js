const express = require("express");

let { Config, User } = require('../schema');
const { isAdmin } = require("../auth/auth");

let configRoutes = express.Router();

configRoutes.route("/openSubmissions").post(isAdmin, async (req, res) => {
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

configRoutes.route("/makeAdmin").post(isAdmin, async (req, res) => {
    if (!req.body.email) {
        return res.send({ error: true, message: "Please enter an email" });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.send({ error: true, message: "User does not exist" });
    }

    user.admin = true;
    await user.save();

    return res.send({ error: false });
});

configRoutes.route("/closeSubmissions").post(isAdmin, async (req, res) => {
    const submissionsOpen = await Config.find({ submissionsOpen: true });
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
    const submissionsOpen = await Config.find({ submissionsOpen: true });
    if (submissionsOpen.length === 0) {
        return res.send({ submissionsOpen: false });
    }
    return res.send({ submissionsOpen: submissionsOpen[0].submissionsOpen });
});

exports.configRoutes = configRoutes;