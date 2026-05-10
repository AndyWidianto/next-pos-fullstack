
export interface CreateProduct {
    name: string;
    price: number;
    stock: number;
    categoryId: string;
}

export interface UpdateProduct extends Partial<CreateProduct> {}


export interface LowStock {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export interface BestSeller {
  id: string;
  name: string;
  sold: number;
  revenue: number;
}