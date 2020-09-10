const express = require("express");
const passport = require("passport");
const { createLink } = require("../auth/strategies.js");

let authRoutes = express.Router();

authRoutes.route("/login").get((request, response, next) => {
    const callbackURL = createLink(request, "auth/login/callback");
    passport.authenticate('oauth2', { callbackURL })(request, response, next);
});

authRoutes.route("/login/callback").get((request, response, next) => {
    const callbackURL = createLink(request, "auth/login/callback");

    if (request.query.error === "access_denied") {
        response.redirect("/auth/login");
        return;
    }

    passport.authenticate("oauth2", {
        failureRedirect: "/",
        successReturnToOrRedirect: "/",
        callbackURL
    })(request, response, next);
});

authRoutes.route("/check").get((request, response, next) => {
    if (request.user) {
        return response.status(200).json(request.user);
    } else {
        return response.status(400).json({ "success": false });
    }
});

authRoutes.route("/logout").all(async (request, response) => {
    if (request.user) {
        const options = {
            method: 'POST',
            url: process.env.GROUND_TRUTH_URL + '/auth/logout',
            headers:
            {
                Authorization: `Bearer ${request.user.token}`
            }
        };

        await request(options, async (err, res, body) => {
            if (err) { return console.log(err); }
            await request.logout();
            response.redirect("/auth/login");
        });
    }
    else {
        response.redirect("/auth/login");
    }
});

exports.authRoutes = authRoutes;