import type { APIContext, MiddlewareNext } from "astro";

function onRequest (context: APIContext, next: MiddlewareNext): Promise<Response> | Response | Promise<void> | void {
    
}