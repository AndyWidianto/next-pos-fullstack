import { prisma } from "../prisma";
import { verifyAccessToken } from "../token.service";
import { CreateTransaction } from "../types";


export async function createTransaction(token: string, data: CreateTransaction) {
    const payload = verifyAccessToken(token);
    const count = await prisma.transaction.count();
    const invoiceNumber = `INV-${count}`;

    const transaction = await prisma.$transaction([
        prisma.transaction.create({
            data: {
                totalPrice: data.totalPrice,
                discount: data.discount,
                paymentMethod: data.paymentMethod,
                tax: data.tax,
                invoiceNumber: invoiceNumber,
                userId: payload.id,
                items: {
                    createMany: {
                        data: data.items
                    }
                },
            }
        }),
        ...data.items.map(d => {
            return prisma.product.update({
                where: { id: d.productId },
                data: {
                    stock: {
                        decrement: d.quantity
                    }
                }
            });
        })
    ]);
    return transaction;
}

export async function statsTransaction(token: string) {
    verifyAccessToken(token);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [incomeToday, total] = await prisma.$transaction([
        prisma.transaction.aggregate({
            where: {
                createdAt: {
                    gte: startOfToday,
                }
            },
            _sum: {
                totalPrice: true
            }
        }),
        prisma.transaction.count()
    ]);
    const totalPendapatan = incomeToday._sum.totalPrice || 0;
    return {
        income: totalPendapatan,
        total: total
    }
}