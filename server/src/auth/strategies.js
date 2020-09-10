const { URL } = require("url");
const { Strategy: OAuthStrategy } = require("passport-oauth2");
const { createNew, User } = require("../schema.js");

exports.GroundTruthStrategy = class GroundTruthStrategy extends OAuthStrategy {
    constructor(url) {
        const secret = (process.env.GROUND_TRUTH_SECRET);
        const id = (process.env.GROUND_TRUTH_ID);
        if (!secret || !id) {
            throw new Error(`Client ID or secret not configured in environment variables for Ground Truth`);
        }
        let options = {
            authorizationURL: new URL("/oauth/authorize", url).toString(),
            tokenURL: new URL("/oauth/token", url).toString(),
            clientID: id,
            clientSecret: secret,
            passReqToCallback: true
        };
        super(options, GroundTruthStrategy.passportCallback);
        this.url = url;
    }

    userProfile(accessToken, done) {
        this._oauth2._request("GET", new URL("/api/user", this.url).toString(), null, null, accessToken, (err, data) => {
            if (err) {
                done(err);
                return;
            }
            try {
                let profile = {
                    ...JSON.parse(data),
                    token: accessToken
                };
                done(null, profile);
            }
            catch (err) {
                return done(err);
            }
        });
    }

    static async passportCallback(req, accessToken, refreshToken, profile, done) {
        let user = await User.findOne({ uuid: profile.uuid });

        if (!user) {
            user = createNew(User, { ...profile });
        } else {
            user.token = accessToken;
        }

        await user.save();
        done(null, user);
    }
}

function getExternalPort(req) {
    function defaultPort() {
        // Default ports for HTTP and HTTPS
        return req.protocol === "http" ? 80 : 443;
    }

    const host = req.headers.host;

    if (!host || Array.isArray(host)) {
        return defaultPort();
    }

    // IPv6 literal support
    const offset = host[0] === "[" ? host.indexOf("]") + 1 : 0;
    const index = host.indexOf(":", offset);

    if (index !== -1) {
        return parseInt(host.substring(index + 1), 10);
    }
    else {
        return defaultPort();
    }
}

exports.createLink = (req, link) => {
    if (link[0] === "/") {
        link = link.substring(1);
    }
    if ((req.secure && getExternalPort(req) === 443) || (!req.secure && getExternalPort(req) === 80)) {
        return `http${req.secure ? "s" : ""}://${req.hostname}/${link}`;
    }
    else {
        return `http${req.secure ? "s" : ""}://${req.hostname}:${getExternalPort(req)}/${link}`;
    }
}
