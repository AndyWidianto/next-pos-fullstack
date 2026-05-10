import handlerError from "@/lib/handleError";
import { createProduct, getProducts } from "@/lib/services/productService";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    const data = await req.json();
    const headers = req.headers;
    const token = headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
    }
    try {
        const product = await createProduct(token, data);
        return NextResponse.json(product, { status: 201 });
    } catch (err) {
        console.error("Terjadi Kesalahan: ", err);
        return handlerError(err);
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get("limit");
        const lastId = searchParams.get("lastId");
        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const headers = req.headers;
        const token = headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
        }
        const products = await getProducts(token, limit, lastId, search, category);
        return NextResponse.json(products);
    } catch (err) {
        console.error("Terjadi Kesalahan: ", err);
        return handlerError(err);
    }
}