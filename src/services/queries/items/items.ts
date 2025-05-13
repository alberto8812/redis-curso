import { itemsKeys } from '$services/keys';
import { client } from '$services/redis';
import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { deserialize } from './deserialize';
import { serialize } from './serialize';

export const getItem = async (id: string) => {
    const itemkey = itemsKeys(id);
    const item = await client.hGetAll(itemkey);
    if (Object.keys(item).length === 0) {
        return null;
    }
    console.log('Item', deserialize(id, item));
    return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
    const itemPromes = ids.map(id => getItem(id));
    const items = await Promise.all(itemPromes);
    return items;
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    const id = genId();
    const keyId = itemsKeys(id);
    const serialized = serialize(attrs);
    await client.hSet(keyId, serialized);

    return id;

};

