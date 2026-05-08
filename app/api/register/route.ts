import handlerError from "@/lib/handleError";
import { authRegister } from "@/lib/services/authService";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const data = await req.json();
    try {
        const regis = await authRegister(data);
        return NextResponse.json(regis);
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}