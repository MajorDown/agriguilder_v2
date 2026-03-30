export type CreateSessionInput = {
    email: string;
    password: string;
    ipMask: string;
    userAgent: string;
}

export type SessionOutput = {
    sessionToken: string;
    accessToken: string;
}
