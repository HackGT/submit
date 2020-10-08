let { Category } = require('../schema')
const express = require("express");

let categoryRoutes = express.Router();

categoryRoutes.route("/all").get(async (req, res) => {
    res.send(await Category.find().populate("hackathon"));
});

categoryRoutes.route("/create").post(async (req, res) => {
    if (!req.body.data) {
        return res.send({ error: true, message: "Request data not provided" });
    }

    try {
        return res.send(await Category.create(req.body.data));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

categoryRoutes.route("/update").post(async (req, res) => {
    if (!req.body.id || !req.body.data) {
        return res.send({ error: true, message: "Request data not provided" });
    }

    try {
        return res.send(await Category.findOneAndUpdate({ _id: req.body.id }, req.body.data, { new: true }));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

categoryRoutes.route("/delete").post(async (req, res) => {
    if (!req.body.id) {
        return res.send({ error: true, message: "Request data not provided" });
    }

    try {
        return res.send(await Category.deleteOne({ _id: req.body.id }));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

exports.categoryRoutes = categoryRoutes;