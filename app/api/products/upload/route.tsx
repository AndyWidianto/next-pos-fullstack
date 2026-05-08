import handlerError from "@/lib/handleError";
import { uploadExcel } from "@/lib/services/productService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        { error: "Format file harus Excel (.xlsx atau .xls)" },
        { status: 400 }
      );
    }
    const products = await uploadExcel(file);

    return NextResponse.json({
      message: "Data berhasil diproses",
      data: products,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return handlerError(error);
  }
}