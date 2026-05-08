import jwt from "jsonwebtoken";
import { UnAuthorizationError } from "./exception";
import { Payload, TokenPayload } from "./types";

const accessToken = process.env.SECRET_ACCESS_TOKEN!;
const refreshToken = process.env.SECRET_REFRESH_TOKEN!;
export function createAccessToken({ id, name, email, role }: Payload) {
    return jwt.sign({ id, name, email, role }, accessToken, { expiresIn: "17m" })
}
export function createRefreshToken({ id, name, email, role }: Payload) {
    return jwt.sign({ id, name, email, role }, refreshToken, { expiresIn: "7d" })
}

function verifyToken(token: string, secret: string): TokenPayload {
    try {
        return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error("Token status: Expired");
            throw new UnAuthorizationError("Token telah kadaluwarsa");
        }

        if (error instanceof jwt.JsonWebTokenError) {
            console.error("Token status: Malformed/Invalid Signature");
            throw new UnAuthorizationError("Token tidak valid");
        }

        console.error("Token status: Unknown error", error);
        throw new UnAuthorizationError("Gagal memvalidasi sesi");
    }
}

export const verifyAccessToken = (token: string) => {
    return verifyToken(token, accessToken);
};

export const verifyRefreshToken = (token: string) => {
    return verifyToken(token, refreshToken);
};