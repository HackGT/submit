const express = require("express");

let submissionRoutes = express.Router();

/*
    Form Step 1: Retrieve emails of users on team
    - Query emails from check-in and ensure users accepted to event
    - Create new user objects for users not in db (with email field and name from check-in)
    - update database with team info

    Response:
    - errors
*/
submissionRoutes.route("/team-validation").post((req, res) => {
});

/*
    Form Step 2:
    - Get prize categories for submission from
    - Classify team into category based on user tracks (from registration)
    - Validate prizes selected and make sure team is eligible
    - update database with prize categories

    Response:
    - errors
*/
submissionRoutes.route("/prize-validation").post((req, res) => {

})

/*
    Form Step 3:
    - Get devpost url
    - Make sure devpost submission prize categories matches up with submitted prize categories
    - Run duplicate check

    Response:
    - errors
*/
submissionRoutes.route("/devpost-validation").post((req, res) => {

})

exports.submissionRoutes = submissionRoutes;