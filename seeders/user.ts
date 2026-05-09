
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();


export default async function User() {
    const password = await bcrypt.hash(process.env.PASSWORD!, 10);
    const email = process.env.EMAIL!;
    const user = await prisma.user.upsert({
        where: { email: email },
        update: {}, 
        create: {
            username: "Andy",
            password: password,
            role: "admin",
            email: email,
        }
    });

    console.log("Seeding admin berhasil:", user.username);
}