import type { ProductDTO, CategoryDTO, ProductDTOPage, StatusResponse, CategoryDTOPage, BoucherDTO } from "./types";

const apiRoute = import.meta.env.VITE_API_URL;
const apiInventoryRoute = "/inventory";
export const MIN_ITEMS_PER_REQUEST = 25;
export const MAX_ITEMS_PER_REQUEST = 100;

export const productCall = Object.seal({
    prefix: "/product",
    all: async function () {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/all`;
        const res = await fetch(cl, { method: "GET"});

        if (!res.ok) {
            throw new Error("Error al cargar registros!");
        }

        return await res.json() as ProductDTO[];
    },
    page: async function (nPage: number, elements:number | null | undefined | void) {
        if (nPage < 1) nPage = 1;
        if (!elements) elements = MIN_ITEMS_PER_REQUEST;
        if (elements < MIN_ITEMS_PER_REQUEST) elements = MIN_ITEMS_PER_REQUEST;
        if (elements > MAX_ITEMS_PER_REQUEST) elements = MAX_ITEMS_PER_REQUEST;

        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/page/${nPage}?limit=${elements}`;
        const res = await fetch(cl, { method: "GET" });

        if (!res.ok) {
            throw new Error("Error al obtener pagina!");
        }

        return await res.json() as ProductDTOPage;
    },
    add: async function (body: ProductDTO) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/add`;

        console.log(body);

        const res = await fetch(cl, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error("Error al crear registro!");
        }

        return await res.json() as ProductDTO;
    },
    delete: async function (id: number) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/delete/${id}`;
        const res = await fetch(cl, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Error al eliminar registro!");
        }

        return await res.json() as StatusResponse;
    },
    update: async function (body: ProductDTO) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/update`;
        const res = await fetch(cl, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error("Error al actualizar registro!");
        }

        return await res.json() as ProductDTO;
    },
    getSingle: async function (id: number) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/${id}`;
        const res = await fetch(cl, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error("Error al cargar registro!");
        }

        return await res.json() as ProductDTO;
    }
});

export const categoryCall = Object.seal({
    prefix: "/category",
    all: async function () {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/all`;
        const res = await fetch(cl, { method: "GET"});

        if (!res.ok) {
            throw new Error("Error al cargar registros!");
        }

        return await res.json() as CategoryDTO[];
    },
    page: async function (nPage: number, elements:number | null | undefined | void) {
        if (nPage < 1) nPage = 1;
        if (!elements) elements = MIN_ITEMS_PER_REQUEST;
        if (elements < MIN_ITEMS_PER_REQUEST) elements = MIN_ITEMS_PER_REQUEST;
        if (elements > MAX_ITEMS_PER_REQUEST) elements = MAX_ITEMS_PER_REQUEST;

        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/page/${nPage}?limit=${elements}`;
        const res = await fetch(cl, { method: "GET" });

        if (!res.ok) {
            throw new Error("Error al obtener pagina!");
        }

        return await res.json() as CategoryDTOPage;
    },
    add: async function (body: CategoryDTO) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/add`;
        const res = await fetch(cl, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error("Error al crear registro!");
        }

        return await res.json() as CategoryDTO;
    },
    delete: async function (id: number) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/delete/${id}`;
        const res = await fetch(cl, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Error al eliminar registro!");
        }

        return await res.json() as StatusResponse;
    },
    update: async function (body: CategoryDTO) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/update`;
        const res = await fetch(cl, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error("Error al actualizar registro!");
        }

        return await res.json() as CategoryDTO;
    },
    getSingle: async function (id: number) {
        const cl = `${apiRoute}${apiInventoryRoute}${this.prefix}/${id}`;
        const res = await fetch(cl, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error("Error al cargar registro!");
        }

        return await res.json() as CategoryDTO;
    }
});

export const sellCall = Object.seal({
    prefix: "/sell",
    add: async function (dto: BoucherDTO) {
        const cl = `${apiRoute}${this.prefix}/add`;

        const res = await fetch(cl, {
            method: "POST",
            body: JSON.stringify(dto),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error("Error al crear registro!");
        }

        return await res.json() as BoucherDTO;
    }
});