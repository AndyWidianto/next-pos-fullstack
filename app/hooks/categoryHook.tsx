"use client";
import useAxios from "@/lib/axios.service";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function useCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showStockModal, setShowStockModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showAuditLog, setShowAuditLog] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: ""
    });
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { apiPrivate } = useAxios();
    const itemsPerPage = 10;

    const filteredCategory = categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredCategory.length / itemsPerPage);
    const paginationCategory = filteredCategory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const iconOptions = [
        // Elektronik & IT
        { label: "Smartphone", value: "Smartphone" },
        { label: "Laptop", value: "Laptop" },
        { label: "Bot (AI)", value: "Bot" },

        // Makanan & Minuman
        { label: "Makanan", value: "Utensils" },
        { label: "Minuman", value: "Coffee" },
        { label: "Daging", value: "Beef" },

        // Alat Rumah Tangga
        { label: "Lampu", value: "Lamp" },
        { label: "Kulkas", value: "Refrigerator" },
        { label: "Mesin Cuci", value: "WashingMachine" },
    ];

    const handleExport = () => {
        toast.success('Data berhasil di-export ke Excel');
    };

    const handleImport = () => {
        toast.success('Data berhasil di-import');
        setShowImportModal(false);
    };


    async function fetchCategories() {
        try {
            const res = await apiPrivate.get("/categories");
            const data = res.data;
            setCategories(data); //prev => [...prev, ...data]
        } catch (err) {
            console.error(err);
        }
    }
    // Fungsi untuk membuat kategori baru
    const createCategory = async () => {
        try {
            const res = await apiPrivate.post("/categories", formData);
            console.log("Category created:", res.data);
            setCategories(prev => [res.data, ...prev]);
            handleClose();
        } catch (err) {
            console.error("Error creating category:", err);
            throw err;
        }
    };

    // Fungsi untuk memperbarui kategori yang sudah ada
    const updateCategory = async (id: string) => {
        try {
            const res = await apiPrivate.patch(`/categories/${id}`, formData);
            console.log("Category updated:", res.data);
            handleClose();
        } catch (err) {
            console.error("Error updating category:", err);
            throw err;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (categoryId) {
                await updateCategory(categoryId);
            } else {
                await createCategory();
            }
            await fetchCategories();
            setShowCreateModal(false);
            setFormData({ name: "", description: "", icon: "" });
        } catch (err) {
            alert("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (category: Category) => {
        setCategoryId(category.id);
        setFormData({
            name: category.name,
            description: category.description || "",
            icon: category.icon
        });
        setShowCreateModal(true);
    }
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus kategori ini?");

        if (!confirmDelete) return;
        try {
            // Tampilkan loading toast agar user tahu proses sedang berjalan
            const loadingToast = toast.loading("Sedang menghapus kategori...");

            const res = await apiPrivate.delete(`/categories/${id}`);
            toast.dismiss(loadingToast);
            toast.success("Kategori berhasil dihapus!");
            await fetchCategories();

        } catch (err: any) {
            console.error("Delete error:", err);
            const errorMessage = err.response?.data?.message || "Gagal menghapus kategori.";
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        setShowAuditLog(false);
        setShowCreateModal(false);
        setShowImportModal(false);
        setCategoryId(null);
        setFormData({
            name: "",
            description: "",
            icon: ""
        })
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        paginationCategory,
        totalPages,
        handleExport,
        handleImport,
        setSearchQuery,
        setShowAuditLog,
        showAuditLog,
        searchQuery,
        showImportModal,
        showStockModal,
        currentPage,
        itemsPerPage,
        setShowImportModal,
        setCurrentPage,
        setShowStockModal,
        filteredCategory,
        showCreateModal,
        handleClose,
        setShowCreateModal,
        handleSubmit,
        loading,
        formData,
        setFormData,
        iconOptions,
        handleUpdate,
        handleDelete,
        categoryId
    }
}