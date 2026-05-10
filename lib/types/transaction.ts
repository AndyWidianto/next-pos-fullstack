
export interface CreateTransaction {
    totalPrice: number;
    tax: number;
    discount: number;
    paymentMethod: string;
    items: CreateTransactionItem[];
}

export interface CreateTransactionItem {
    productId: string;
    quantity: number;
    priceAtTime: number;
}