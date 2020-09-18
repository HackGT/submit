const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const {User, Team, Category, Submission} = require("./schema")
dotenv.config();

let app = express();
exports.app = app;

app.use(morgan("dev"));
app.use(compression());
app.use(cors());

const { isAuthenticated } = require("./auth/auth.js");

const { authRoutes } = require("./routes/auth.js");
const { submissionRoutes } = require("./routes/submission.js");

app.use("/auth", authRoutes);
app.use("/submission", submissionRoutes)

// Serve React app
app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (request, response) => {
    response.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});


app.get('/dashboard', isAuthenticated, (req, res) => {

})

/*
    Args:
        devpost_url: string (url)
        members: [string] (user emails)
        categories: [string] (categories)
*/
app.post('/submission', isAuthenticated, (req, res) => {

})

app.get('/categories', isAuthenticated, (req, res) => {
    return await Category.find({});
})

app.listen(process.env.PORT, () => {
    console.log(`Submit system started on port ${process.env.PORT}`);
});
