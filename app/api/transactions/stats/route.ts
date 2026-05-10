import handlerError from "@/lib/handleError";
import { statsTransaction } from "@/lib/services/transactionService";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const headers = req.headers;
        const token = headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
        }
        const stats = await statsTransaction(token);
        return NextResponse.json(stats);
    } catch (err) {
        console.error("Terjadi kesalahan: ", err);
        return handlerError(err);
    }
}