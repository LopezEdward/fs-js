export type TitleType = "upper" | "only-logo" | "only-title";

export type Product = {
    id: number,
    categoryId?: number,
    name: string,
    stock: number
}

export type Category = {
    id: number,
    name: string
}

export interface ProductDTOForm {
    id?: number,
    name: string,
    stock: number,
    price: number,
    categoryId?: number
}

export interface CategoryDTOForm {
    name: string
}

export interface SellDTOForm {
    products: {
        id: number,
        quantity: number
    }[] | [],
    final_mount: number,
    total: number
}