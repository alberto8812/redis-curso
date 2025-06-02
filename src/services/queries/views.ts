import { itemByViewsKeys, itemsKeys, itemsViewKey } from "$services/keys";
import { client } from "$services/redis";

export const incrementView = async (itemId: string, userId: string) => {

    /**
     * ingresa la vista para alamacenar 
     * si ya existe retorna 0  si no retorna uno 
    */
    const inserted = await client.pfAdd(itemsViewKey(itemId), userId);
    if (inserted) {
        return Promise.all(
            [
                client.hIncrBy(itemsKeys(itemId), 'views', 1),
                client.zIncrBy(itemByViewsKeys(), 1, itemId)
            ])
    }

};
