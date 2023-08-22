import { createClient } from 'redis';
const client = createClient({
  url: `redis://:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});


client.on('error', err => console.log('Redis Client Error', err));
async function configureRedisClient(): Promise<void> {
  await client.connect();
}
configureRedisClient();

export const redisSet = async (key:string,value: any,expires?:number|undefined) => {
  if(value===undefined){
    return false
  }
  let expire_time = expires === undefined ? 7200 : expires
  
  try{
    await client.set(key, JSON.stringify(value));
    await client.expire(key,expire_time)
    return true
  }catch(e){
    console.log('Redis Set Error',e)
    return false
  }  
}

export const redisGet = async (key:string) => {
  try{
    const result = await client.get(key);
    if(result === null){ return null}
    return JSON.parse(result)
  }catch(e){
    console.log('Redis Get Error',e)
    return false
  }
}

export const redisDel = async (key:string) => {
  try{
    await client.del(key)
    return true
  }catch(e){
    console.log('Redis delete Error',e)
    return false 
  }
}

export const redisDelAll = async () => {
  try{
    await client.flushDb()
    console.log('Cache removido com sucesso')
    return true
  }catch(e){
    console.log('Redis deleteAll Error')
    return true
  }
}





export default client;