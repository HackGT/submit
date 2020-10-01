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

export type Category = {
    name: string;
}

export type Hackathon = {
    name: string;
    isActive: boolean;
}

export type Submission = {
    devpost: string;
    categories: Category[];
    hackathon: Hackathon;
}