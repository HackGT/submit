const { app } = require("../app.js");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const { User } = require("../schema.js");
const { GroundTruthStrategy } = require("./strategies.js");

// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
if (process.env.PRODUCTION === 'true') {
    app.enable("trust proxy");
}
else {
    console.warn("OAuth callback(s) running in development mode");
}

const session_secret = process.env.SESSION_SECRET;
if (!session_secret) {
    throw new Error("Secret not specified");
}
app.use(session({
    secret: session_secret,
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());

exports.isAuthenticated = (request, response, next) => {
    response.setHeader("Cache-Control", "private");

    if (!request.isAuthenticated() || !request.user) {
        if (request.session) {
            request.session.returnTo = request.originalUrl;
        }
        response.redirect("/auth/login");
    } else {
        next();
    }
}

exports.isAdmin = (request, response, next) => {
	response.setHeader("Cache-Control", "private");
	const auth = request.headers.authorization;

	if (process.env.PRODUCTION !== "true" || (request.user && request.user.admin)) {
		next();
	} else if (auth && typeof auth === "string" && auth.includes(" ")) {
		const key = auth.split(" ")[1].toString();
		if (key === process.env.SUBMIT_SECRET) {
			next();
		}
		else {
			response.status(401).json({
				"error": "Incorrect auth token provided"
			});
		}
	} else {
		response.status(401).json({
			error: "No auth token provided"
		});
	}
}

const groundTruthStrategy = new GroundTruthStrategy(String(process.env.GROUND_TRUTH_URL));

passport.use(groundTruthStrategy);
passport.serializeUser((user, done) => {
    done(null, user.uuid);
});
passport.deserializeUser((id, done) => {
    User.findOne({ uuid: id }, (err, user) => {
        done(err, user);
    });
});
