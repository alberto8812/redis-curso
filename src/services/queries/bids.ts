import { bidHistoryKey, itemsKeys } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs, Bid } from '$services/types';
import { DateTime } from 'luxon'
import { getItem } from './items';
export const createBid = async (attrs: CreateBidAttrs) => {
	// ENCONTRAR EL ITEN 
	const item = await getItem(attrs.itemId);
	if (!item) {
		throw new Error('item does not exist');
	}
	// validar si el presio ofrecudi es nayor
	if (item.price >= attrs.amount) {
		throw new Error('Bid too low')
	}

	if (item.endingAt.diff(DateTime.now()).toMillis() < 0) {
		throw new Error('item closed to bidding')

	}
	const serialized = serializeHistory(
		attrs.amount,
		attrs.createdAt.toMillis(),
	)

	return Promise.all(
		[
			client.rPush(bidHistoryKey(attrs.itemId), serialized),
			client.hSet(
				itemsKeys(item.id),
				{
					bids: item.bids + 1,
					price: attrs.amount,
					highestBidUserId: attrs.userId
				}
			)

		]
	)

};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count;
	const endIndex = -1 - offset;
	const result = await client.lRange(bidHistoryKey(itemId), startIndex, endIndex)
	return result.map(deserializeHistory);
};

const serializeHistory = (amount: number, createAt: number) => {
	return `${amount}:${createAt}`
}

const deserializeHistory = (stored: string) => {
	const [amount, createdAt] = stored.split(':');
	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	}
}