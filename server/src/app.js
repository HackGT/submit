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

const { isAuthenticated } = require("./auth/auth.js");

const { authRoutes } = require("./routes/auth.js");
const { submissionRoutes } = require("./routes/submission.js");
const { categoryRoutes } = require("./routes/category.js");
const { hackathonRoutes } = require("./routes/hackathon.js");

app.use("/auth", authRoutes);
app.use("/submission", isAuthenticated, submissionRoutes);
app.use("/category", isAuthenticated, categoryRoutes);
app.use("/hackathon", isAuthenticated, hackathonRoutes);


// app.get('/dashboard', isAuthenticated, (req, res) => {

// })

// /*
//     Args:
//         devpost_url: string (url)
//         members: [string] (user emails)
//         categories: [string] (categories)
// */
// app.post('/submission', isAuthenticated, (req, res) => {

// })

// app.get('/categories', isAuthenticated, (req, res) => {
//     return await Category.find({});
// })

app.use("/public", isAuthenticated, express.static(path.join(__dirname, "/public")));

// Serve React app
app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (request, response) => {
    response.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`Submit system started on port ${process.env.PORT}`);
});
