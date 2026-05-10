import handlerError from "@/lib/handleError";
import { categorySchema } from "@/lib/schemas/categorySchema";
import { createCategory, getCategories } from "@/lib/services/categoryService";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const body = await req.json();
    const headers = req.headers;
    const auth = headers.get("Authorization");
    const token = auth?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorization" }, {
            status: 401
        });
    }
    const parseResult = categorySchema.safeParse(body);
    if (!parseResult.success) {
        return NextResponse.json({ message: "Bad request", error: parseResult.error.flatten().fieldErrors }, {
            status: 400
        });
    }
    try {
        const category = await createCategory(token, parseResult.data);
        return NextResponse.json(category);
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}

export async function GET(req: NextRequest) {
    const headers = req.headers;
    const auth = headers.get("Authorization");
    const token = auth?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorization" }, {
            status: 401
        });
    }
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const lastId = searchParams.get("lastId");
    const search = searchParams.get("search");
    try {
        const categories = await getCategories(token, limit, lastId, search);
        return NextResponse.json(categories);
    } catch (err) {
        console.error(err);
        return handlerError(err);
    }
}