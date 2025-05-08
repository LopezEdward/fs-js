import type { Product, Category } from "../../types";

const apiRoute = "/api/v1";

const apiProductRoute = "/inventory";
export const productCall = {
    all: async function (limit?: number) {
        if (!limit || limit === undefined) {
            limit = 20;
        }

        const cl = `${apiRoute}${apiProductRoute}/all?limit=${limit}`;

        return fetch(cl, {
            method: "GET"
        });
    },
    page: async function (nPage: number, lastIndex:number) {
        const cl = `${apiRoute}${apiProductRoute}/page?n=${nPage}&li=${lastIndex}`;

        return fetch(cl, {
            method: "GET"
        });
    }
}