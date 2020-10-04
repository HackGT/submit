let {Team, User, Submission} = require('../schema')
const express = require("express");
const request = require("request");
const axios = require("axios")

let submissionRoutes = express.Router();
const GRAPHQLURL = process.env.GRAPHQLURL || 'https://registration.2020.hack.gt/graphql'
/*
    Form Step 1: Retrieve emails of users on team
    - Query emails from check-in and ensure users accepted to event
    - Create new user objects for users not in db (with email field and name from check-in)
    - update database with team info

    Response:
    - errors
*/
submissionRoutes.route("/team-validation").post(async (req, res) => {
    const emails = req.body.members
    if (emails[0] !== req.user.email) {
        res.send({"error": true, "message": "Invalid body: email does not match"})
        return;
    }

    if (emails.length > 4) {
        res.send({"error": true, "message": "Too many members on team"})
        return;
    }
    let submission = null;
    if (req.body.submissionId) {
        submission = await Submission.findById(req.body.submissionId);
    } else {
        submissionObj = new Submission({
            "emails": [],
            "members": []
        })
        submission = await submissionObj.save();
    }
    let errConfirmed = null;
    const userIds = await Promise.all(emails.map(async email => {
        console.log("hello",email)
        const query = `
        query($search: String!) {
            search_user(search: $search, offset: 0, n: 1) {
                users {
                    name
                    confirmed
                }
            }
        }`;
        const variables = {
            search: email
        };
        const options = { method: 'POST',
            url: GRAPHQLURL,
            headers: {
                Authorization: 'Bearer ' + process.env.GRAPHQLAUTH,
                'Content-Type': "application/json"
            },
            data: JSON.stringify({
                query,
                variables
            })
        };
        let resp = await axios(options);
        let confirmed = false;
        const users = resp.data.data.search_user.users
        if (users.length > 0) {
            confirmed = users[0].confirmed;
        }
        if (!confirmed) {
            console.log("nah",email)
            errConfirmed = email;
            return;
        }
        let updatedUser = await User.findOneAndUpdate({"email": email}, {
            "$addToSet": {submissions: submission._id}
        },{
            new: true,
            upsert: true
        })
        return updatedUser._id
    }))
    if (errConfirmed) {
        res.send({"error": true, "message": "User: " + errConfirmed + " not confirmed for HackGT 7"});
        return;
    }
    await Submission.findByIdAndUpdate(submission._id, {
        "$set": {
            members: userIds
        }
    });
    res.send({
        "error": false, "submissionId": submission._id
    })
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

});

/*
    Form Step 3:
    - Get devpost url
    - Make sure devpost submission prize categories matches up with submitted prize categories
    - Run duplicate check

    Response:
    - errors
*/
submissionRoutes.route("/devpost-validation").post((req, res) => {

});


submissionRoutes.route("/submission/:submissionId").get(async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId).populate("members");

        if (!submission) {
            return res.send({ error: true, message: "Submission not found: Invalid Id" });
        }

        return res.send({ error: false, submission: submission });
    } catch {
        return res.send({ error: true, message: "Submission not found: Invalid Id" });
    }
});


exports.submissionRoutes = submissionRoutes;
