export const pageCahcheKey = (route: string) => {
    return 'pagecache#' + route;
}

export const usersKey = (userId: string) => `users#${userId}`;