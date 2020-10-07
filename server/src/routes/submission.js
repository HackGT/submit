let { Team, User, Submission } = require('../schema')
const express = require("express");
const request = require("request");
const axios = require("axios")

let submissionRoutes = express.Router();
const GRAPHQLURL = process.env.GRAPHQLURL || 'https://registration.2020.hack.gt/graphql';
const CURRENT_HACKATHON = "HackGT 7";

/*
    Form Step 1: Retrieve emails of users on team
    - Query emails from check-in and ensure users accepted to event
    - Create new user objects for users not in db (with email field and name from check-in)
    - update database with team info

    Response:
    - errors
*/
submissionRoutes.route("/team-validation").post(async (req, res) => {
    const members = req.body.members;

    if (!members || members.length === 0) {
        return res.send({"error": true, "message": "Must include at least one member"});
    } else if (members.length > 4) {
        return res.send({"error": true, "message": "Too many members on team"})
    }

    const emails = members.map(member => member.email);

    if (emails[0] !== req.user.email) {
        return res.send({"error": true, "message": "Email does not match current user"})
    }

    let errConfirmed = null;
    let errSubmission = null;

    const userIds = await Promise.all(emails.map(async email => {
        const query = `
            query($search: String!) {
                search_user(search: $search, offset: 0, n: 1) {
                    users {
                        name
                        confirmed
                    }
                }
            }
        `;

        const variables = {
            search: email
        };

        const options = {
            method: 'POST',
            url: GRAPHQLURL,
            headers: {
                "Authorization": 'Bearer ' + process.env.GRAPHQLAUTH,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                query,
                variables
            })
        };

        const res = await axios(options);
        const users = res.data.data.search_user.users;

        if (users.length === 0 || !users[0].confirmed) {
            errConfirmed = email;
            return;
        }

        let user = await User.findOne({ "email": email }).populate('submissions');

        if (!user) {
            user = await User.create({
                email: email,
                submissions: []
            });
        } else if (user.submissions.map(submission => submission.hackathon).includes(CURRENT_HACKATHON)) {
            errSubmission = user.email
            return;
        }

        return user._id
    }))

    if (errConfirmed) {
        return res.send({"error": true, "message": "User: " + errConfirmed + " not confirmed for " + CURRENT_HACKATHON});
    }
    if (errSubmission) {
        return res.send({"error": true, "message": "User: " + errSubmission + " already has a submission for " + CURRENT_HACKATHON});
    }

    console.log(userIds)

    return res.send({ error: false });
});

/*
    Form Step 2:
    - Get prize categories for create from
    - Classify team into category based on user tracks (from registration)
    - Validate prizes selected and make sure team is eligible
    - update database with prize categories

    Response:
    - errors
*/
submissionRoutes.route("/prize-validation").post((req, res) => {

});


/*
    Route to get prizes for a particular create, should be different for each hackathon
 */
submissionRoutes.route("/prizes").post(async (req, res) => {
    // TODO: Make registration requests to get confirmation branch of participants and filter out prizes from there
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
    res.send({ });
});



// Last step of the form, all the data is passed in here and a submission should be created
submissionRoutes.route("/create").post(async (req, res) => {
    const data = req.body.submission;

    let submission = await Submission.create({
        hackathon: CURRENT_HACKATHON,
        devpost: data.devpost,
        name: data.name,
        members: await User.find({email: data.members.map(member => member.email)}),
        prizes: []
    });

    console.log(req.body);
    res.send("Done");
});


submissionRoutes.route("/submission/:submissionId").get(async (req, res) => {
    try {
        if (req.params.submissionId === undefined) {
            return res.send({ error: false, submission: "No submission Id provided" });
        }

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
