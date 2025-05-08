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