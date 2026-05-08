import handlerError from "@/lib/handleError";
import { deleteProduct, updateProduct } from "@/lib/services/productService";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, params: Promise<{ id: string }>) {
    const data = await req.json();
    const { id } = await params;
    const headers = req.headers;
    const token = headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauhtorization" }, { status: 401 });
    }
    try {
        const product = await updateProduct(token, id, data);
        return NextResponse.json(product);
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}

export async function DELETE(req: NextRequest, params: Promise<{ id: string }>) {
    const { id } = await params;
    const headers = req.headers;
    const token = headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauhtorization" }, { status: 401 });
    }
    try {
        const product = await deleteProduct(token, id);
        return NextResponse.json(product);
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}