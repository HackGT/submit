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
        submission = new Submission({
            "emails": [],
            "members": [],
            "hackathon": "HackGT7"
        })
    }
    let errConfirmed = null;
    let errSubmission = null;
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
        let user = await User.findOne({"email": email}).populate('submissions');
        if(user) {
            for(var i = 0;i<user.submissions.length;i++) {
                if(user.submissions[i].hackathon == 'HackGT7' &&
                   user.submissions[i]._id.toString() != submission._id.toString()
              ) {
                    errSubmission = user.email
                    return;
                }
            }
        } else {
            user = await User.create({
                email: email,
                submissions: []
            })
        }



        return user._id
    }))
    if (errConfirmed) {
        res.send({"error": true, "message": "User: " + errConfirmed + " not confirmed for HackGT 7"});
        return;
    }
    if (errSubmission) {
        res.send({"error": true, "message": "User: " + errSubmission + " already has an active submission"});
        return;
    }
    submission["members"] = userIds
    console.log(userIds)
    await submission.save();
    await User.update({"_id": {
        "$in": userIds
    }}, {
        "$addToSet": { submissions: submission._id }
    },{
        "multi": true
    })

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


submissionRoutes.route("/submission").get((req, res) => {

});


exports.submissionRoutes = submissionRoutes;
