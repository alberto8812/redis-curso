export const pageCahcheKey = (route: string) => {
    return 'pagecache#' + route;
}

export const usersKey = (userId: string) => `users#${userId}`;
export const sessionskey = (sessionId: string) => `sessions#${sessionId}`;
export const usernamerUniqueKey = () => `usernames:unique`;

export const userLikeKey = (userId: string) => `user:like#${userId}`;

export const usernamesKey = () => 'usernames';
// items
export const itemsKeys = (itemsId: string) => `items#${itemsId}`;
export const itemByViewsKeys = () => 'item:views';
export const itemsByEndingAtKey = () => 'item:endingAt';