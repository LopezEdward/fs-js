export interface ProductDTO {
    id: number | null,
    name: string,
    stock: number,
    price: number
    category: CategoryDTO | null
}

export interface CategoryDTO {
    id: number | null,
    name?: string
};

export interface BoucherDTO {
    id: number | null,
    boucherType: BoucherType,
    nroDocument: string,
    createAt?: string,
    totalMount?: number,
    finalMount?: number,
    products: BoucherDetailDTO[] | []
}

export interface BoucherDetailDTO {
    productId: number,
    quantity: number,
    price?: number
}

export interface DTOPage<T> {
    content: T[] | [],
    pageNumber: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    last: boolean
    first: boolean
}

export interface ProductDTOPage extends DTOPage<ProductDTO> {};
export interface CategoryDTOPage extends DTOPage<CategoryDTO> {};

export interface StatusResponse {
    complete: boolean,
    message: string | null
}

export type BoucherType = "BOLETA" | "FACTURA";