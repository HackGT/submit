const { app } = require("../app.js");
const passport = require("passport");
const session = require("express-session");
const { User } = require("../schema.js");
const { GroundTruthStrategy } = require("./strategies.js");

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
    resave: true
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
