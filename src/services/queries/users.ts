import { usersKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {

};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(usersKey(id));
    const transformedUser = deserialize(id, user);
    return transformedUser;

};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId();
    const redisUserKey = usersKey(id);

    await client.hSet(redisUserKey, serialize(attrs));
    return id;
};

const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password
    };

}

const deserialize = (id: string, user: Record<string, string>) => {
    return {
        id,
        username: user.username,
        password: user.password
    };

}