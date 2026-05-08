import { Prisma } from "@prisma/client";
import { CreateCategory, UpdateCategory } from "../types";
import { prisma } from "../prisma";
import { AppError, BadRequestError, ForbiddenError } from "../exception";
import { verifyAccessToken } from "../token.service";

export async function createCategory(token: string, data: CreateCategory) {
    const payload = verifyAccessToken(token);
    console.log(payload);
    if (payload.role === "user") {
        throw new ForbiddenError("anda tidak diizinkan untuk merubah atau menambahkan data category");
    }
    const category = await prisma.category.create({
        data: data
    });
    return category;
}

export async function getCategories(limitStr?: string | null, lastId?: string | null, search?: string | null) {
    let query: Prisma.CategoryFindManyArgs = {};
    let limit = 10;
    if (lastId) {
        query = {
            ...query,
            cursor: {
                id: lastId
            }
        }
    }
    if (limitStr) {
        limit = Number(limitStr);
    }
    if (search) {
        query = {
            ...query,
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        }
    }

    const categories = await prisma.category.findMany({
        ...query
    });
    return categories;
}

export async function findOne(id: string) {
    const existing = await prisma.category.findFirst({
        where: { id }
    });
    if (!existing) {
        throw new AppError("Category not found", 404);
    }
    return existing;
}

export async function updateCategory(token: string, id: string, data: UpdateCategory) {
    const payload = verifyAccessToken(token);
    if (payload.role === "user") {
        throw new ForbiddenError("anda tidak diizinkan untuk merubah atau menambahkan data category");
    }
    if (data.name && !data.name.trim()) {
        throw new BadRequestError("Name tidak boleh kosong");
    }
    const existing = await findOne(id);
    const category = await prisma.category.update({
        where: { id: existing.id },
        data: { ...data }
    });
    return category;
}

export async function deleteCategory(token: string, id: string) {
    const payload = verifyAccessToken(token);
    if (payload.role === "user") {
        throw new ForbiddenError("anda tidak diizinkan untuk merubah atau menambahkan data category");
    }
    const existing = await findOne(id);
    await prisma.category.delete({
        where: { id: existing.id }
    });
    return { message: "Category berhasil di hapus" };
}