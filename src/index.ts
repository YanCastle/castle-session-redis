import * as Redis from 'ioredis'
import SessionDriver from 'castle-session/dist/session'
const redis: {
    instance: Redis.Redis | any
} = {
    instance: undefined
}
export default class SessionRedis extends SessionDriver {
    async start(ctx: any, config: any) {
        await super.start(ctx, config)
        if (!redis.instance) {
            redis.instance = new Redis(config);
        }
    }
    async exist(SessionID: string) {
        return (await redis.instance.keys(`${this.getKey('')}*`)).length > 0
    }
    async get(key: string) {
        try {
            return await redis.instance.get(this.getKey(key))
        } catch (error) {
            return undefined;
        }
    }
    async set(key: string, value: string) {
        await redis.instance.set(this.getKey(key), value);
        return true;
    }
    async delete(key: string) {
        return await redis.instance.del(this.getKey(key))
    }
    async destory() {
        let keys = await redis.instance.keys(`${this.getKey('')}*`)
        let p = [];
        for (let i = 0; i < keys.length; i++) {
            p.push(redis.instance.del(keys[i]))
        }
        await Promise.all(p)
    }
} 