import { NextResponse } from "next/server";
import { AppError, BadRequestError, ForbiddenError, UnAuthorizationError } from "./exception";
import { ZodError } from "zod";

export default function handlerError(err: any) {
    if (err instanceof AppError) {
        return NextResponse.json(
            {
                status: "error",
                message: err.message
            },
            { status: err.statusCode }
        );
    }
    if (err instanceof BadRequestError) {
        return NextResponse.json({
            status: "error",
            message: err.message
        }, { status: err.statusCode });
    }
    if (err instanceof UnAuthorizationError) {
        return NextResponse.json({
            status: "error",
            message: err.message
        }, { status: err.statusCode });
    }
    if (err instanceof ForbiddenError) {
        return NextResponse.json({
            status: "error",
            message: err.message
        }, { status: err.statusCode });
    }
    if (err instanceof ZodError) {
        return NextResponse.json(
            {
                status: "fail",
                message: "Validasi data gagal",
                errors: err.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }
    if (err.code === "P2002") {
        return NextResponse.json(
            {
                status: "error",
                message: "Data sudah ada (Duplicate entry)",
            },
            { status: 409 }
        );
    }
    console.error("Uncontrolled Error 💥:", err);
    return NextResponse.json(
        {
            status: "error",
            message: "Terjadi kesalahan pada server"
        },
        { status: 500 }
    );
}