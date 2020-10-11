const { User, Submission } = require("../schema");
const { config } = require("../common");
const express = require("express");
const axios = require("axios");
const rp = require("request-promise");
const cheerio = require('cheerio');

const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://registration.2020.hack.gt/graphql';
const CURRENT_HACKATHON = "HackGT 7";
const HACKGT_DEVPOST = "https://hackgt2020.devpost.com/";

let submissionRoutes = express.Router();


/*
    - Query emails from check-in and ensure users accepted to event
    - Create new user objects for users not in db (with email field and name from check-in)
*/
validateTeam = async (members, user_email) => {
    if (!members || members.length === 0) {
        return res.send({ error: true, message: "Must include at least one member" });
    } else if (members.length > 4) {
        return res.send({ error: true, message: "Too many members on team" })
    }

    const emails = members.map(member => member.email);
    if (emails[0] !== user_email) {
        return { error: true, message: "Email does not match current user" }
    }

    let errConfirmed = null;
    let errSubmission = null;

    const registrationUsers = await Promise.all(emails.map(async email => {
        const query = `
            query($search: String!) {
                search_user(search: $search, offset: 0, n: 1) {
                    users {
                        name
                        email
                        confirmationBranch
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
            url: GRAPHQL_URL,
            headers: {
                "Authorization": 'Bearer ' + process.env.GRAPHQL_AUTH,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                query,
                variables
            })
        };

        const res = await axios(options);
        const registrationUsers = res.data.data.search_user.users;

        if (registrationUsers.length === 0 || !registrationUsers[0].confirmed) {
            errConfirmed = email;
            return;
        }

        let user = await User.findOne({ "email": email });

        if (!user) {
            await User.create({
                name: registrationUsers[0].name,
                email: email
            });
        } else {
            try {
                const submissions = await Submission.find({ members: user, hackathon: CURRENT_HACKATHON });
                if (submissions.length > 0) {
                    errSubmission = user.email
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }

        return registrationUsers[0];
    }))

    if (errConfirmed) {
        return { error: true, message: "User: " + errConfirmed + " not confirmed for " + CURRENT_HACKATHON };
    }
    if (errSubmission) {
        return {
            error: true,
            message: "User: " + errSubmission + " already has a submission for " + CURRENT_HACKATHON
        };
    }

    const eligiblePrizes = getEligiblePrizes(registrationUsers);

    return { error: false, eligiblePrizes };
}

/*
    - Ensure url is the right devpost url
    - Ensure project isn't submitted to multiple hackathons
*/
validateDevpost = async (devpost_url) => {
    if (!devpost_url) {
        return { error: true, message: "No url specified" };
    }

    const hostname = new URL(devpost_url).hostname;
    if (hostname !== "devpost.com") {
        return { error: true, message: "Invalid URL: Not devpost domain" };
    }

    let html = ""
    try {
        html = await rp(devpost_url);
    } catch (err) {
        return { error: true, message: "Invalid Project URL" };
    }

    const $ = cheerio.load(html);
    let devpost_urls = [];
    let submitted = false;

    $('#submissions').find('ul').children("li").each((index, elem) => {
        const item = $(elem).find("div a").attr("href");
        if (item) {
            devpost_urls.push(item);
            if (item === HACKGT_DEVPOST) {
                submitted = true;
            }
        }
    });

    let eligible = submitted && (devpost_urls.length === 1);
    if (eligible) {
        return { error: false };
    } else if (!submitted) {
        return { error: true, message: "Project not submitted to HackGT 7 Devpost" };
    } else if (devpost_urls.length !== 1) {
        return { error: true, message: "Project submitted to multiple hackathons" };
    }
}

/*
    - Classify team into category based on user tracks (from registration)
    - Return eligible prizes based on team type
*/
getEligiblePrizes = (users) => {
    switch (CURRENT_HACKATHON) {
        case "HackGT 7":

            let numEmerging = 0;

            users.forEach(user => {
                if (!user.confirmationBranch) {
                    return res.send({
                        error: true,
                        message: "User: " + user.email + " does not have a confirmation branch"
                    });
                }

                if (user.confirmationBranch === "Emerging Participant Confirmation") {
                    numEmerging++;
                }
            });

            // A team must be greater than 50% emerging to be eligible for emerging prizes
            if (numEmerging / users.length > 0.5) {
                return config.hackathons["HackGT 7"].emergingPrizes.concat(config.hackathons["HackGT 7"].sponsorPrizes);
            }
            return config.hackathons["HackGT 7"].sponsorPrizes;
        default:
            return [];
    }
}

submissionRoutes.route("/team-validation").post(async (req, res) => {
    const resp = await validateTeam(req.body.members, req.user.email)
    res.send(resp);
});

// TODO: Fill in prize validation as needed
submissionRoutes.route("/prize-validation").post((req, res) => {
    res.send({ error: false });
});

submissionRoutes.route("/devpost-validation").post(async (req, res) => {
    const resp = await validateDevpost(req.body.devpost);
    res.send(resp);
});

// Last step of the form, all the data is passed in here and a submission should be created
submissionRoutes.route("/create").post(async (req, res) => {
    if (!req.body.submission) {
        return res.send({ error: true, message: "Invalid submission" });
    }
    const data = req.body.submission;

    const teamValidation = await validateTeam(data.members, req.user.email)
    if (teamValidation.error) {
        return res.send({ error: true, message: "Invalid team" })
    }

    const devpostValidation = await validateDevpost(data.devpost)
    if (devpostValidation.error) {
        return res.send({ error: true, message: "Invalid devpost submission" })
    }

    try {
        await Submission.create({
            hackathon: CURRENT_HACKATHON,
            devpost: data.devpost,
            name: data.name,
            members: await User.find({ email: data.members.map(member => member.email) }),
            categories: data.prizes
        });
    } catch (err) {
        return res.send({ error: true, message: "Submission could not be saved - please contact help desk" });
    }

    res.send({ error: false });
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

submissionRoutes.route("/dashboard").get(async (req, res) => {
    try {
        return res.send(await Submission.find({ members: req.user._id }).populate("members"));
    } catch (err) {
        console.error(err);
        return res.send({ error: true, message: err.message });
    }
});

exports.submissionRoutes = submissionRoutes;