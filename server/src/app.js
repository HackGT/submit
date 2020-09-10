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
app.use(cors());

const { isAuthenticated } = require("./auth/auth.js");

const { authRoutes } = require("./routes/auth.js");

app.use("/auth", authRoutes);

// Serve React app
app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (request, response) => {
    response.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`Submit system started on port ${process.env.PORT}`);
});
