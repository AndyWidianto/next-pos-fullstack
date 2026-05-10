import handlerError from "@/lib/handleError";
import { statsProduct } from "@/lib/services/productService";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const headers = req.headers;
        const token = headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
        }
        const stat = await statsProduct(token);
        return NextResponse.json(stat);
    } catch (err) {
        console.error("Terjadi kesalahan: ", err);
        return handlerError(err);
    }
}