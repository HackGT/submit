const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URL = String(process.env.MONGO_URL);
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    throw err;
});
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

exports.createNew = (model, doc) => {
    return new model(doc);
}

exports.User = mongoose.model("User", new mongoose.Schema({
    uuid: {
        type: String,
        index: true
    },
    token: String,
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    admin: Boolean,
    slack: String
},
    {
        usePushEach: true
    }
));

exports.Team = mongoose.model("Team", new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }],
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
        unique: true
    }
}));

exports.Hackathon = mongoose.model("Hackathon", new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isActive: Boolean
}));

exports.Config = mongoose.model("Config", new mongoose.Schema({
    submissionsOpen: Boolean
}));

exports.Video = mongoose.model("Videos", new mongoose.Schema({
    isActive: Boolean
}));

var submissionSchema = new mongoose.Schema({
    prizes: {
        type: [String],
        default: []
    },
    projectId: Number,
    round: {
        type: String,
        enum: ['FLAGGED', 'SUBMITTED', 'ACCEPTED', 'REJECTED']
    },
    hackathon: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    devpost: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    meetingUrl: {
        type: String,
        required: true,
        unique: true
    },
    expo: {
        type: Number
    }
})

submissionSchema.plugin(autoIncrement.plugin, { model: 'Submission', field: 'projectId' })

exports.Submission = mongoose.model("Submission", submissionSchema);
