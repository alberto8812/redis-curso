import { itemByViewsKeys, itemsKeys } from "$services/keys";
import { client } from "$services/redis";

export const incrementView = async (itemId: string, userId: string) => {
    return Promise.all(
        [
            client.hIncrBy(itemsKeys(itemId), 'views', 1),
            client.zIncrBy(itemByViewsKeys(), 1, itemId)
        ])
};
