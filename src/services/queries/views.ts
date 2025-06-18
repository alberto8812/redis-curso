import { itemByViewsKeys, itemsKeys, itemsViewKey } from "$services/keys";
import { client } from "$services/redis";

export const incrementView = async (itemId: string, userId: string) => {
    return client.incrementView(itemId, userId)

};

// KEYS i need  too acces
// 1. itemViewsKey->
// 2. itemskey -> ITEM#45545
// 3. itemsByvIEWSkEY
//EVALSHA ID 3 

// ARGUMENTS i NEDD TO ACCEPT
// 1.itemId
// 2. userId