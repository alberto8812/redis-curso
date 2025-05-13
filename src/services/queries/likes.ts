import { itemsKeys, userLikeKey } from "$services/keys";
import { client } from "$services/redis";
import { getItems } from "./items/items";


export const userLikesItem = async (itemId: string, userId: string) => {
    const itemKey = userLikeKey(userId);
    const item = await client.sIsMember(itemKey, itemId);
    return item
};

export const likedItems = async (userId: string) => {
    // fetch all liked items for a user
    const ids = await client.sMembers(userLikeKey(userId));

    //fetch all the item hashes with those id and return a array of items
    return getItems(ids);

};

export const likeItem = async (itemId: string, userId: string) => {
    const isnerte = await client.sAdd(userLikeKey(userId), itemId);
    console.log('isnerte', isnerte);
    if (isnerte) {
        return client.hIncrBy(itemsKeys(itemId), 'likes', 1);
    }

};

export const unlikeItem = async (itemId: string, userId: string) => {
    const removed = await client.sRem(userLikeKey(userId), itemId);
    if (removed) {
        return client.hIncrBy(itemsKeys(itemId), 'likes', -1);

    }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
    const ids = await client.sInter([userLikeKey(userOneId), userLikeKey(userTwoId)]);
    return getItems(ids);
};
