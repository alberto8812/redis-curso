import { sessionskey } from '$services/keys';
import { client } from '$services/redis';
import { Session } from '../types';

export const getSession = async (id: string) => {
    const sessionKey = sessionskey(id);
    const session = await client.hGetAll(sessionKey);
    if (Object.keys(session).length === 0) {
        return null;
    }
    return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
    console.log('Saving session', session);
    const sessionKey = sessionskey(session.id);
    const sessionData = serializeSession(session);
    await client.hSet(sessionKey, sessionData);
};

const serializeSession = (session: Session) => {
    return {
        userId: session.userId,
        username: session.username
    };
}

const deserialize = (id: string, session: Record<string, string>) => {
    return {
        id,
        userId: session.userId,
        username: session.username
    };
}