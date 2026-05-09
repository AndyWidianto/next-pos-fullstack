import useAxios from "@/lib/axios.service";
import { Category, Prisma } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "sonner";


type ProductWithCategory = Omit<Prisma.ProductGetPayload<{
    include: { category: true }
}>, "price"> & { price: string };

interface CreateProduct {
    name: string;
    categoryId: string;
    code: string;
    price: number;
    stock: number;
    init: string;
}

export default function useInventory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectCategory, setSelectCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showStockModal, setShowStockModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showAuditLog, setShowAuditLog] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
    const [adjustmentQty, setAdjustmentQty] = useState('');
    const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
    const [productId, setProductId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateProduct>({
        name: "",
        categoryId: "",
        code: "",
        price: 0,
        stock: 0,
        init: "",
    });
    const [totalPages, setTotalPages] = useState(0);
    const [nextId, setNextId] = useState<string | null>(null);
    const itemsPerPage = 2;

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleStockAdjustment = () => {
        if (!selectedProduct || !adjustmentQty) return;
        toast.success(`Stok ${selectedProduct.name} berhasil diupdate`);
        setShowStockModal(false);
        setAdjustmentQty('');
    };

    const handleExport = () => {
        toast.success('Data berhasil di-export ke Excel');
    };

    const handleImport = () => {
        toast.success('Data berhasil di-import');
        setShowImportModal(false);
    };
    const { apiPrivate } = useAxios();


    async function fetchCategories() {
        try {
            const res = await apiPrivate.get("/categories");
            const data = res.data;
            setCategories(data); //prev => [...prev, ...data]
        } catch (err) {
            console.error(err);
        }
    }
    async function fetchProducts(lastId?: string) {
        let query = `${searchQuery ? `&search=${searchQuery}` : ''}${selectCategory ? `&category=${selectCategory}` : ``}${lastId ? `&lastId=${lastId}` : ''}`;
        try {
            const res = await apiPrivate.get(`/products?limit=${itemsPerPage}${query}`);
            const data = res.data;
            if (data.products.length < itemsPerPage) {
                setNextId(null);
            } else {
                setNextId(data.products[data.products.length - 1].id);
            }
            setProducts(prev => [...prev, ...data.products]);
            setTotalPages(data.totalPage);
            console.log(data.total);
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Gagal menagmbil data products.";
            toast.error(errorMessage);
        }
    }

    function handleClose() {
        setShowAuditLog(false);
        setShowCreateModal(false);
        setShowImportModal(false);
        setProductId(null);
        setFormData({
            name: "",
            categoryId: "",
            code: "",
            price: 0,
            stock: 0,
            init: "",
        })
    }

    const handleUpdate = (product: ProductWithCategory) => {
        setFormData({
            name: product.name,
            categoryId: product.categoryId,
            code: product.code,
            price: Number(product.price),
            stock: product.stock,
            init: product.init,
        });
        setProductId(product.id);
        setShowCreateModal(true);
    }

    const createProduct = async () => {
        try {
            const res = await apiPrivate.post("/products", formData);
            console.log("Product created:", res.data);
            setProducts(prev => [res.data, ...prev]);
            handleClose();
        } catch (err) {
            console.error("Error creating Product:", err);
            throw err;
        }
    };

    const updateProduct = async (id: string) => {
        try {
            const dataToSend: Partial<CreateProduct> = {};
            const product = products.find(p => p.id === id);
            Object.entries(formData).forEach(([key, val]) => {
                if ((product as any)[key] !== val) {
                    (dataToSend as any)[key] = val;
                }
            })
            const res = await apiPrivate.patch(`/products/${id}`, dataToSend);
            console.log("Product updated:", res.data);
            setProducts(prev => prev.map(p => {
                if (p.id === id) {
                    return res.data;
                }
                return p;
            }))
            handleClose();
        } catch (err) {
            console.error("Error updating Product:", err);
            throw err;
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus produk ini?");

        if (!confirmDelete) return;
        try {
            const loadingToast = toast.loading("Sedang menghapus produk...");

            await apiPrivate.delete(`/products/${id}`);
            toast.dismiss(loadingToast);
            toast.success("produk berhasil dihapus!");
            setProducts(prev => prev.filter(p => p.id === id));
        } catch (err: any) {
            console.error("Delete error:", err);
            const errorMessage = err.response?.data?.message || "Gagal menghapus produk.";
            toast.error(errorMessage);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (productId) {
                await updateProduct(productId);
            } else {
                await createProduct();
            }
            await fetchCategories();
            setShowCreateModal(false);
            setFormData({
                name: "",
                categoryId: "",
                code: "",
                price: 0,
                stock: 0,
                init: "",
            });
        } catch (err) {
            alert("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        setCurrentPage(Math.max(1, currentPage - 1));
    }
    const handleCurrent = async () => {
        setCurrentPage(Math.min(totalPages, currentPage + 1))
        if ((currentPage + 1) * itemsPerPage > products.length && nextId) {
            fetchProducts(nextId);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);
    useEffect(() => {
        setProducts([]);
        const timer = setTimeout(() => fetchProducts(), 500);
        return () => {
            clearTimeout(timer);
        }
    }, [searchQuery, selectCategory]);

    return {
        categories,
        products,
        selectCategory,
        setSelectCategory,
        setSearchQuery,
        totalPages,
        paginatedProducts,
        loading,
        showStockModal,
        showAuditLog,
        showImportModal,
        setCurrentPage,
        setShowAuditLog,
        setSelectedProduct,
        adjustmentQty,
        setAdjustmentQty,
        setAdjustmentType,
        adjustmentType,
        handleExport,
        handleImport,
        handleStockAdjustment,
        setShowImportModal,
        setShowStockModal,
        searchQuery,
        filteredProducts,
        currentPage,
        selectedProduct,
        setShowCreateModal,
        showCreateModal,
        formData,
        setFormData,
        handleClose,
        productId,
        handleSubmit,
        showCamera,
        setShowCamera,
        handleUpdate,
        handleDelete,
        handlePrev,
        handleCurrent
    }
}