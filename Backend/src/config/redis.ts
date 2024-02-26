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

  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
  const keyReg = environment+':'+key
  if(value===undefined){
    return false
  }
  const defaultExpires = 30;

  // Se expires não for fornecido ou for undefined, atribui o valor padrão
 

  let expire_time =  expires ?? defaultExpires;
  
  try{
   //console.log("EXPIRE TIME >>",keyReg,expire_time)
    await client.set(keyReg, JSON.stringify(value));
    await client.expire(keyReg,expire_time)
    return true
  }catch(e){
    console.error('Redis Set Error',e)
    return false
  }  
}

export const redisGet = async (key:string) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
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
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
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



//SETS

export const addSet = async (key:string,member:string,expires?:number|undefined) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
  const keyReg = environment+':'+key  
  const defaultExpires = 30; 
  let expire_time =  expires ?? defaultExpires;
  
  try{
   //console.log("EXPIRE TIME >>",keyReg,expire_time)
    await client.sAdd(keyReg,member)
    await client.expire(keyReg,expire_time)
    return true
  }catch(e){
    console.error('Redis sAdd Error',e)
    return false
  }  
}
export const remSet = async (key:string,member:string) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
  const keyReg = environment+':'+key
  try{
    await client.sRem(keyReg,member)
    return true
  }catch(e){
    console.error('Redis remSet Error',e)
    return false 
  }
}

export const checkSet = async (key:string,member:string) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
  const keyReg = environment+':'+key
  try{
    const check = await client.sIsMember(keyReg,member)
    return check
  }catch(e){
    console.error('Redis checkSet Error',e)
    return false 
  }
}



export const getSet = async (key:string) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
  const keyReg = environment+':'+key
  try{
    const result = await client.sMembers(keyReg);
    if(result === null){ return null}
    return result
  }catch(e){
    console.error('Redis Get Sets',e)
    return false
  }
}
export const countSet = async (key:string) => {
  const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod'
  const keyReg = environment+':'+key
  try {
    const total = await client.sCard(keyReg)
    return total
  }catch(e){
    console.error('Redis sCard Error',e)
    return false 
  }
}




export default client;