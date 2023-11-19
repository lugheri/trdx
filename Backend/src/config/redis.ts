import { createClient } from 'redis';
const client = createClient({
  url: `redis://:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});


client.on('error', err => console.error('Redis Client Error', err));
async function configureRedisClient(): Promise<void> {
  await client.connect();
}
configureRedisClient();

export const redisSet = async (key:string,value: any,expires?:number|undefined) => {

  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : ''
  const keyReg = environment+':'+key
  if(value===undefined){
    return false
  }
  const defaultExpires = 30;

  // Se expires não for fornecido ou for undefined, atribui o valor padrão
 

  let expire_time =  expires ?? defaultExpires;
  
  try{
   
    await client.set(keyReg, JSON.stringify(value));
    await client.expire(key,expire_time)
    return true
  }catch(e){
    console.error('Redis Set Error',e)
    return false
  }  
}

export const redisGet = async (key:string) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : ''
  const keyReg = environment+':'+key
  try{
    const result = await client.get(keyReg);
    if(result === null){ return null}
    return JSON.parse(result)
  }catch(e){
    console.error('Redis Get Error',e)
    return false
  }
}

export const redisDel = async (key:string) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : ''
  const keyReg = environment+':'+key
  try{
    await client.del(keyReg)
    return true
  }catch(e){
    console.error('Redis delete Error',e)
    return false 
  }
}

export const redisDelAll = async () => {
  try{
    await client.flushDb()
    console.info('Cache removido com sucesso')
    return true
  }catch(e){
    console.error('Redis deleteAll Error')
    return true
  }
}





export default client;