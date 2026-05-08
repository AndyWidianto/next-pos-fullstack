import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";


export interface Login {
    username: string;
    password: string;
}

export interface Payload {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface TokenPayload extends JwtPayload, Payload {}

export interface Register {
    username: string;
    password: string;
    email: string;
}
