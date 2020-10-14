export type User = {
    uuid: string;
    name: string;
    email: string;
    team: Team;
    admin: boolean;
    slack: string;
}

export type Team = {
    members: User[];
    submision: Submission;
}

export type Hackathon = {
    name: string;
    image: string;
    isActive: boolean;
}

export type Submission = {
    devpost: string;
    prizes: string[];
    hackathon: Hackathon;
}