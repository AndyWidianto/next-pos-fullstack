import useAxios from "@/lib/axios.service";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";


interface CartItem extends Product {
    quantity: number;
}

export default function usePos() {
    const [products, setProducts] = useState<Product[]>([]);
    const { apiPrivate } = useAxios();
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'transfer'>('cash');
    const [cashReceived, setCashReceived] = useState('');
    const [nextId, setNextId] = useState<string | null>(null);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [showCamera, setShowCamera] = useState(false);
    const limit = 10;

    const addToCart = (product: Product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        toast.success(`${product.name} ditambahkan ke keranjang`);
    };

    const updateQuantity = (id: string, change: number) => {
        setCart(
            cart
                .map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter((item) => item.id !== id));
        toast.success('Item dihapus dari keranjang');
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    };

    const calculateChange = () => {
        const received = parseFloat(cashReceived) || 0;
        return received - calculateTotal();
    };

    const handlePayment = () => {
        if (cart.length === 0) {
            toast.error('Keranjang kosong');
            return;
        }
        if (paymentMethod === 'cash' && calculateChange() < 0) {
            toast.error('Uang tidak cukup');
            return;
        }
        setShowPaymentModal(false);
        setShowReceiptModal(true);
    };

    const handlePrintReceipt = () => {
        toast.success('Struk berhasil dicetak');
        setShowReceiptModal(false);
        setCart([]);
        setCashReceived('');
    };

    const handleHoldTransaction = () => {
        toast.success('Transaksi ditunda');
        setCart([]);
    };

    const total = calculateTotal();
    const tax = total * 0.1;
    const grandTotal = total + tax;


    async function fetchProducts() {
        try {
            let query = '';
            if (nextId) {
                query += `&lastId=${nextId}`;
            }
            if (searchQuery.trim()) {
                query += `&search=${searchQuery}`;
            }
            const res = await apiPrivate.get(`/products?limit=${limit}${query}`);
            console.log(res.data)
            const data = res.data;
            setProducts(prev => [...data.products, ...prev]);
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Gagal menagmbil data products.";
            toast.error(errorMessage);
        }
    }
    async function findProduct(code: string) {
        try {
            const res = await apiPrivate.get(`/products?limit=1&search=${code}`);
            console.log(res.data)
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Gagal menagmbil data products.";
            toast.error(errorMessage);
        }
    }
    useEffect(() => {
        setProducts([]);
        const handler = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    return {
        products,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        showReceiptModal,
        showPaymentModal,
        setPaymentMethod,
        filteredProducts,
        addToCart,
        updateQuantity,
        removeFromCart,
        handlePayment,
        searchQuery,
        cart,
        grandTotal,
        setShowPaymentModal,
        total,
        tax,
        setCart,
        handleHoldTransaction,
        paymentMethod,
        cashReceived,
        calculateChange,
        setCashReceived,
        handlePrintReceipt,
        setShowReceiptModal,
        showCamera,
        setShowCamera,
        findProduct
    }
}