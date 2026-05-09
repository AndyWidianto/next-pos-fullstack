import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function createCategories() {
  const categories = [
    {
      name: "Minuman Dingin",
      description: "Aneka jus, air mineral, dan minuman kemasan lainnya",
      icon: "CupSoda",
    },
    {
      name: "Minuman Panas",
      description: "Kopi, teh, dan susu bubuk",
      icon: "Coffee",
    },
    {
      name: "Kebutuhan Dapur",
      description: "Minyak goreng, bumbu dapur, dan beras",
      icon: "UtensilsCrossed",
    },
    {
      name: "Pembersih Rumah",
      description: "Deterjen, sabun cuci piring, dan pembersih lantai",
      icon: "Eraser", // Bisa juga menggunakan 'Sparkles'
    },
    {
      name: "Perawatan Tubuh",
      description: "Sabun mandi, sampo, dan pasta gigi",
      icon: "Bath",
    },
    {
      name: "Camilan & Snack",
      description: "Biskuit, keripik, dan cokelat",
      icon: "Cookie",
    },
    {
      name: "Obat-obatan",
      description: "Obat umum, vitamin, dan P3K",
      icon: "Pill",
    },
    {
      name: "Alat Tulis",
      description: "Buku, pulpen, dan perlengkapan kantor",
      icon: "Pencil",
    },
    {
      name: "Produk Susu",
      description: "Keju, mentega, dan yogurt",
      icon: "Milk",
    },
    {
      name: "Roti & Selai",
      description: "Roti tawar, roti manis, dan aneka selai",
      icon: "Croissant",
    },
  ];

  console.log("Memulai proses seeding kategori...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: "" }, // Karena ID menggunakan ULID, kita gunakan Upsert berdasarkan Nama jika ingin unik
      update: {},
      create: {
        name: category.name,
        description: category.description,
        icon: category.icon,
      },
    });
  }

  console.log(`${categories.length} Kategori berhasil dibuat!`);
}