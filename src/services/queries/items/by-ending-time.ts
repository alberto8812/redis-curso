import { itemsByEndingAtKey, itemsKeys } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";

export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	/**
	 * conseguimos los datos del orden de creacion de los 
	 * articolus paginados pbtenemos los ids
	 */
	const ids = await client.zRange(itemsByEndingAtKey(),
		Date.now(),
		'+inf',
		{
			BY: "SCORE",
			LIMIT: {
				offset,
				count
			}
		}
	)

	/**
	 * conseguimos todos los products
	 */
	const products = ids.map(id => {
		return client.hGetAll(itemsKeys(id))
	})


	const result = await Promise.all(products)

	/*
	mapeamos 
	*/
	return result.map((item, index) => deserialize(ids[index], item))
};
