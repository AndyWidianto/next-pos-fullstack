import { Prisma, Product } from "@prisma/client";
import { AppError, BadRequestError, ForbiddenError } from "../exception";
import { prisma } from "../prisma";
import { verifyAccessToken } from "../token.service";
import { BestSeller, CreateProduct, LowStock, UpdateProduct } from "../types/product";
import * as XLSX from "xlsx";



export function generateSKU(category: string, brand: string): string {
    const catCode = category.substring(0, 3).toUpperCase().replace(/\s+/g, '');
    const brandCode = brand.substring(0, 3).toUpperCase().replace(/\s+/g, '');
    const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${catCode}-${brandCode}-${uniqueId}`;
}
export async function createProduct(token: string, data: CreateProduct) {
    const payload = verifyAccessToken(token);
    if (payload.role === "user") {
        throw new ForbiddenError("Anda tidak diizinkan untuk merubah data product");
    }
    const existing = await prisma.category.findFirst({
        where: { id: data.categoryId }
    });
    if (!existing) {
        throw new AppError("Category not found", 404);
    }
    const sku = generateSKU(existing.name, data.name);
    const product = await prisma.product.create({
        data: { ...data, sku },
        include: {
            category: true
        }
    });
    return product;
}

async function findOne(id: string) {
    const existing = await prisma.product.findFirst({
        where: { id: id }
    });
    if (!existing) {
        throw new AppError("Product not found", 404);
    }
    return existing;
}

export async function updateProduct(token: string, id: string, data: UpdateProduct) {
    const paylaod = verifyAccessToken(token);
    if (paylaod.role === "user") {
        throw new ForbiddenError("Anda tidak diizinkan untuk merubah data product");
    }
    const existing = await findOne(id);
    const productUpdate = await prisma.product.update({
        where: { id: existing.id },
        data: data,
        include: {
            category: true
        }
    });
    console.log(productUpdate);
    return productUpdate;
}
export async function getProducts(token: string, limitStr?: string | null, lastId?: string | null, search?: string | null, category?: string | null) {
    verifyAccessToken(token);
    const limit = limitStr ? Number(limitStr) : 20;

    const whereClause: Prisma.ProductWhereInput = {
        AND: [
            search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } }
                ]
            } : {},
            category ? { category: { name: { contains: category, mode: "insensitive" } } } : {}
        ]
    };

    const query: Prisma.ProductFindManyArgs = {
        where: whereClause,
        take: limit,
        orderBy: { id: "desc" },
        include: { category: true },
    };

    if (lastId) {
        query.cursor = { id: lastId };
        query.skip = 1;
    }

    const [products, totalFiltered] = await Promise.all([
        prisma.product.findMany(query),
        prisma.product.count({ where: whereClause })
    ]);

    return {
        products,
        total: totalFiltered,
        totalPage: Math.ceil(totalFiltered / limit)
    };
}

export async function deleteProduct(token: string, id: string) {
    const payload = verifyAccessToken(token);
    if (payload.role === "user") {
        throw new ForbiddenError("Anda tidak diizinkan untuk merubah data product");
    }
    const existing = await findOne(id);
    await prisma.product.delete({
        where: { id: existing.id }
    });
    return { message: "Product berhasil di hapus" };
}

export async function uploadExcel(file: File) {
    const categories = await prisma.category.findMany();

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const keyAllowed = ["name", "code", "price", "stock", "init", "category"];
    const data: any[] = [];

    jsonData.forEach((row: any) => {
        const product: any = {};

        keyAllowed.forEach((key) => {
            let value = row[key];

            if (key === "price" || key === "stock") {
                product[key] = Number(value) || 0;
            }
            else if (key === "category") {
                const foundCategory = categories.find(
                    c => c.name.toLowerCase() === String(value).toLowerCase()
                );

                if (foundCategory) {
                    product["categoryId"] = foundCategory.id;
                }
            }
            else {
                product[key] = value;
            }
        });
        if (product.name && product.code) {
            data.push(product);
        }
    });

    if (data.length === 0) {
        throw new Error("Data excel tidak sesuai atau kosong");
    }
    const result = await prisma.product.createMany({
        data: data,
        skipDuplicates: true,
    });

    console.log(result);

    return result;
}

export async function statsProduct(token: string) {
    verifyAccessToken(token);
    const [totalProduct, lowStock, bestSeller] = await prisma.$transaction([
        prisma.product.count(),
        prisma.product.findMany({
            where: {
                stock: {
                    lte: 50
                }
            }
        }),
        prisma.transactionItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 5,
        })
    ]);

    const productIds = bestSeller.map(b => b.productId);
    const productsDetail = await prisma.product.findMany({
        where: {
            id: { in: productIds }
        }
    });
    const productBestSeller: BestSeller[] = bestSeller.map(b => {
        const detail = productsDetail.find(p => p.id === b.productId);
        const totalSold = b?._sum?.quantity || 0;
        const price = detail?.price?.toNumber() || 0;

        return {
            id: b.productId,
            name: detail?.name || "Unknown",
            revenue: totalSold * price,
            sold: totalSold
        };
    });
    const productLowStock: LowStock[] = lowStock.map(l => ({
        id: l.id,
        name: l.name,
        stock: l.stock,
        minStock: 50
    }))
    return {
        total: totalProduct,
        alerts: lowStock.length,
        lowStock: productLowStock,
        bestSeller: productBestSeller
    }
}

