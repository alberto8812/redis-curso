import { itemsByPricesKey, itemsKeys } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
    let result: any = await client.sort(
        itemsByPricesKey(),
        {
            // SERA UN MATRIZ 
            GET: [
                '#', // Devuelve la clave base del elemento (por ejemplo 'item1')
                `${itemsKeys('*')}->name`,
                `${itemsKeys('*')}->Views`,
                `${itemsKeys('*')}->endingAt`,
                `${itemsKeys('*')}->imageUrl`,
                `${itemsKeys('*')}->price`,
            ],
            BY: 'nosort',
            DIRECTION: order,
            LIMIT: {
                offset,
                count
            }
        }
    )

    const items = [];
    while (result.length) {
        const [id, name, views, endingAt, imageUrl, price, ...rest] = result;
        const item = deserialize(id, { name, views, endingAt, imageUrl, price });
        items.push(item)
        result = rest;
    }
    console.log(items, "item")
    return items;

};
