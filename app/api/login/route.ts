import handlerError from "@/lib/handleError";
import { authLogin } from "@/lib/services/authService";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const cookieStore = await cookies();
    try {
        const { accessToken, refreshToken, user } = await authLogin(data);
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true, 
            secure: false,
            maxAge: 7 * 60 * 1000
        });
        return NextResponse.json({
            accessToken,
            user
        });
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}