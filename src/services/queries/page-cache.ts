import { pageCahcheKey } from "$services/keys";
import { client } from "$services/redis";

const catchRouter = [
    '/about', '/privacy', '/auth/signin', '/auth/signin',
]

/**
 * funcion que retorna el contenido de la cache
 * @param route 
 * @returns 
 */
export const getCachedPage = (route: string) => {
    if (catchRouter.includes(route)) {
        return client.get(pageCahcheKey(route));
    }
    return null;
};
/**
 * funcion que guarda el contenido en la cache
 * @param route 
 * @param page 
 */
export const setCachedPage = (route: string, page: string) => {
    if (catchRouter.includes(route)) {
        return client.set(pageCahcheKey(route), page, {
            EX: 60 * 60 * 24 // 1 day
        });


    }
};

client.get