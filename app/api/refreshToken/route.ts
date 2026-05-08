import handlerError from "@/lib/handleError";
import { authRefreshToken } from "@/lib/services/authService";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
        return NextResponse.json({ message: "Anda belum login, silahkan login terlebih dahulu" }, { status: 401 });
    }
    try {
        const { accessToken } = await authRefreshToken(refreshToken);
        return NextResponse.json({ accessToken });
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}