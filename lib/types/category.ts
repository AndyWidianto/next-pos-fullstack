
export interface CreateCategory {
    name: string;
    description?: string;
    icon: string;
}
export interface UpdateCategory extends Partial<CreateCategory> {}

