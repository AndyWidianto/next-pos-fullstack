import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash("andy12345$", 10);
    
    const user = await prisma.user.upsert({
        where: { email: "andy@gmail.com" },
        update: {}, 
        create: {
            username: "Andy",
            password: password,
            role: "admin",
            email: "andy@gmail.com",
        }
    });

    console.log("Seeding admin berhasil:", user.username);
}

main();