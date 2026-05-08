import { AppError, BadRequestError } from "../exception";
import { prisma } from "../prisma";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../token.service";
import { Login, Register } from "../types";
import bcrypt from "bcryptjs";


export async function authLogin({ username, password }: Login) {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: username }
            ]
        }
    });
    if (!user) {
        throw new BadRequestError("Username atau password salah");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestError("Username atau password salah");
    }
    const accessToken = createAccessToken({ id: user.id, name: user.name || "", email: user.email, role: user.role });
    const refreshToken = createRefreshToken({ id: user.id, name: user.name || "", email: user.email, role: user.role });
    return { accessToken, refreshToken, user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
    } };
}

export async function authRegister({ username, email, password }: Register) {
    const existing = await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    });
    if (existing) {
        const field = existing.email === email ? "email": "username";
        throw new AppError(`${field} telah tersedia`, 409);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            username,
            email, 
            password: passwordHash,
        }
    });
    return { message: "user berhasil di buat" };
}

export async function authRefreshToken(token: string) {
    const payload = verifyRefreshToken(token);
    const accessToken = createAccessToken({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
    return { accessToken };
}