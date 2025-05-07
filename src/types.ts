export type TitleType = "upper" | "only-logo" | "only-title";

export interface Product {
    id: number,
    categoryId?: number,
    name: string,
    stock: number
}