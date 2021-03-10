const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

let app = express();
exports.app = app;

app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(cors());

// Throw and show a stack trace on an unhandled Promise rejection instead of logging an unhelpful warning
process.on("unhandledRejection", err => {
    throw err;
});

const { isAuthenticated, isAdmin } = require("./auth/auth.js");
const { authRoutes } = require("./routes/auth.js");
const { submissionRoutes } = require("./routes/submission.js");
const { hackathonRoutes } = require("./routes/hackathon.js");
const { ballotRoutes } = require("./routes/ballot.js");
const { configRoutes } = require("./routes/config.js");
const { videoRoutes } = require("./routes/video.js");

app.use("/auth", authRoutes);
app.use("/submission", isAuthenticated, submissionRoutes);
app.use("/hackathon", isAuthenticated, hackathonRoutes);
app.use("/ballot", isAdmin, ballotRoutes);
app.use("/config", isAdmin, configRoutes);
app.use("/video", isAdmin, videoRoutes);

app.use("/public", isAuthenticated, express.static(path.join(__dirname, "/public")));

app.get("/status", (req, res) => {
    res.status(200).send("Success");
});

// Serve React app
app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (request, response) => {
    response.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`Submit system started on port ${process.env.PORT}`);
});
