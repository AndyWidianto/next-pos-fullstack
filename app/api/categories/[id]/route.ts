import handlerError from "@/lib/handleError";
import { deleteCategory, updateCategory } from "@/lib/services/categoryService";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, params: Promise<{ id: string }>) {
    const { id } = await params;
    const body = await req.json();
    const headers = req.headers;
    const token = headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({
            message: "Unauthorization"
        }, { status: 401 });
    }
    try {
        const category = await updateCategory(token, id, body);
        return NextResponse.json(category);
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
        return NextResponse.json({
            message: "Unauthorization"
        }, { status: 401 });
    }
    try {
        const category = await deleteCategory(token, id);
        return NextResponse.json(category);
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}