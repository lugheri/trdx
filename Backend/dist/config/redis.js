"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisDelAll = exports.redisDel = exports.redisGet = exports.redisSet = void 0;
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    url: `redis://:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
client.on('error', err => console.error('Redis Client Error', err));
function configureRedisClient() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
    });
}
configureRedisClient();
const redisSet = (key, value, expires) => __awaiter(void 0, void 0, void 0, function* () {
    const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod';
    const keyReg = environment + ':' + key;
    if (value === undefined) {
        return false;
    }
    const defaultExpires = 30;
    // Se expires não for fornecido ou for undefined, atribui o valor padrão
    let expire_time = expires !== null && expires !== void 0 ? expires : defaultExpires;
    try {
        //console.log("EXPIRE TIME >>",keyReg,expire_time)
        yield client.set(keyReg, JSON.stringify(value));
        yield client.expire(keyReg, expire_time);
        return true;
    }
    catch (e) {
        console.error('Redis Set Error', e);
        return false;
    }
});
exports.redisSet = redisSet;
const redisGet = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod';
    const keyReg = environment + ':' + key;
    try {
        const result = yield client.get(keyReg);
        if (result === null) {
            return null;
        }
        return JSON.parse(result);
    }
    catch (e) {
        console.error('Redis Get Error', e);
        return false;
    }
});
exports.redisGet = redisGet;
const redisDel = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const environment = process.env.ENVIRONMENT === 'DEV' ? 'dev' : 'prod';
    const keyReg = environment + ':' + key;
    try {
        yield client.del(keyReg);
        return true;
    }
    catch (e) {
        console.error('Redis delete Error', e);
        return false;
    }
});
exports.redisDel = redisDel;
const redisDelAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.flushDb();
        console.info('Cache removido com sucesso');
        return true;
    }
    catch (e) {
        console.error('Redis deleteAll Error');
        return true;
    }
});
exports.redisDelAll = redisDelAll;
exports.default = client;
