import { usernamerUniqueKey, usersKey } from '$services/keys';
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


    //see if user already exists
    const exitsUser = await client.sIsMember(usernamerUniqueKey(), attrs.username)
    //if so , trhow error
    if (exitsUser) {
        throw new Error('User already exists');
    }
    //otherwise,continue

    await client.hSet(redisUserKey, serialize(attrs));
    await client.sAdd(usernamerUniqueKey(), attrs.username);
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