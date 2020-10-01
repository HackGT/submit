let {Team, User} = require('../schema')
const express = require("express");

let submissionRoutes = express.Router();
const GRAPHQLURL = process.env.GRAPHQLURL || 'https://registration.hack.gt/graphql'
/*
    Form Step 1: Retrieve emails of users on team
    - Query emails from check-in and ensure users accepted to event
    - Create new user objects for users not in db (with email field and name from check-in)
    - update database with team info

    Response:
    - errors
*/
submissionRoutes.route("/team-validation").post(async (req, res) => {
    const emails = req.body.emails
    emails.forEach(email => {
        let confirmed = false;
        let name = "";
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
            headers:
            {
                Authorization: 'Bearer ' + process.env.GRAPHQLAUTH,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                query,
                variables
            })
        };

        await request(options, (err, res, body) => {
            if (err) { return console.log(err); }
            if (JSON.parse(body).data.search_user.users.length > 0) {
                confirmed = JSON.parse(body).data.search_user.users[0].confirmed;
                name = JSON.parse(body).data.search_user.users[0].name;
            }
        });
        if(!confirmed) {
            res.send({"error": true, "message": "User: " + email + " not confirmed for HackGT 7"});
        }
        User.count({"email": email}, (err, count) {
            if(err) {
                console.log(err)
                throw new Error(err);
            }
            if(count == 0) {
                let new_user = new User({
                    name: "Team " + user1._id + '' + user2._id,
                })
            }
        })
    });
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
