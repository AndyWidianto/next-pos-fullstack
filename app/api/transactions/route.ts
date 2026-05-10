import handlerError from "@/lib/handleError";
import { createTransaction } from "@/lib/services/transactionService";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const data = await req.json();
    try {
        const headers = req.headers;
        const token = headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
        }
        const transaction = await createTransaction(token, data);
        return NextResponse.json(transaction);
    } catch (err) {
        console.error("Terjadi kesalahan: ", err);
        return handlerError(err);
    }
}