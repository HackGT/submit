const mongoose = require("mongoose");

const MONGO_URL = String(process.env.MONGO_URL);
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    throw err;
});

exports.createNew = (model, doc) => {
    return new model(doc);
}

exports.User = mongoose.model("User", new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    token: String,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    admin: Boolean,
    slack: String
},
    {
        usePushEach: true
    }
));

exports.Team = mongoose.model("Team", new mongoose.Schema({
    members: {
        required: true,
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        unique: true
    },
    submission: {
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission"
        },
        unique: true,

    }
}));

exports.Category = mongoose.model("Category", new mongoose.Schema({
    name: String
}));

exports.Hackathon = mongoose.model("Hackathon", new mongoose.Schema({
    name: String,
    isActive: Boolean
}));

exports.Submission = mongoose.model("Submission", new mongoose.Schema({
    devpost: String,
    categories: {
        required: true,
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }]
    },
    hackathon: {
        required: true,
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hackathon"
        }
    }
}));
