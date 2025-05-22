import { usernamerUniqueKey, usersKey, usernamesKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {
    //user the username argument to look up th persons user id
    //with the usernmaes sorted set
    const decimalId = await client.zScore(usernamesKey(), username)

    //make sure we actually got an Id from the lookup
    if (!decimalId) {
        throw new Error('user doues not exist');
    }
    //take the id and  convert it back to hex
    const id = decimalId.toString(16)
    //use the id  to look up th users hash
    const user = await client.hGetAll(usersKey(id));

    return deserialize(id, user)
}
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
    await client.zAdd(usernamesKey(), {
        value: attrs.username,
        score: parseInt(id, 16) //el socre suempre debe de ser de tipo numerico
    });
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