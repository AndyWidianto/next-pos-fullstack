
export interface CreateProduct {
    name: string;
    price: number;
    stock: number;
    categoryId: string;
}

export interface UpdateProduct extends Partial<CreateProduct> {}