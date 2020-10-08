let { Hackathon } = require('../schema')
const express = require("express");

let hackathonRoutes = express.Router();

hackathonRoutes.route("/all").get(async (req, res) => {
    res.send(await Hackathon.find());
});

hackathonRoutes.route("/create").post(async (req, res) => {
    if (!req.body.data) {
        return res.send({ error: true, message: "Request data not provided" });
    }

    try {
        return res.send(await Hackathon.create(req.body.data));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

hackathonRoutes.route("/update").post(async (req, res) => {
    if (!req.body.id || !req.body.data) {
        return res.send({ error: true, message: "Request data not provided" });
    }

    try {
        return res.send(await Hackathon.findOneAndUpdate({ _id: req.body.id }, req.body.data, { new: true }));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

hackathonRoutes.route("/delete").post(async (req, res) => {
    if (!req.body.id) {
        return res.send({ error: true, message: "Request data not provided" });
    }

    try {
        return res.send(await Hackathon.deleteOne({ _id: req.body.id }));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

exports.hackathonRoutes = hackathonRoutes;