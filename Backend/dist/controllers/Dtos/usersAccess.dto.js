"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleAccessPartialDTO = exports.ModuleAccessDTO = exports.CredentialAccessPartialDTO = exports.CredentialAccessDTO = exports.LevelAccessPartialDTO = exports.LevelAccessDTO = exports.PaginationUserDTO = exports.UserDataPartialDTO = exports.UserDataDTO = exports.UserAccessDTO = void 0;
const zod_1 = require("zod");
const md5_1 = __importDefault(require("md5"));
//Auth 
exports.UserAccessDTO = zod_1.z.object({
    username: zod_1.z.string().email('Nome de usuário inválido'),
    password: zod_1.z.string().min(5, 'A senha deve ter mais de 5 dígitos'),
});
//USERS
exports.UserDataDTO = zod_1.z.object({
    name: zod_1.z.string(),
    mail: zod_1.z.string(),
    credential: zod_1.z.number(),
    password: zod_1.z.string().transform(v => (0, md5_1.default)(v)),
    reset: zod_1.z.optional(zod_1.z.number()).default(1),
    logged: zod_1.z.optional(zod_1.z.number()).default(0),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
});
exports.UserDataPartialDTO = exports.UserDataDTO.partial();
exports.PaginationUserDTO = zod_1.z.object({
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    page: zod_1.z.optional(zod_1.z.number()).default(1),
    order: zod_1.z.optional(zod_1.z.enum(['ASC', 'DESC'])).default('ASC'),
    orderedBy: zod_1.z.optional(zod_1.z.string()).default('id'),
});
//LEVELS
exports.LevelAccessDTO = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()).default('Sem Descrição'),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
});
//PARTIAL
exports.LevelAccessPartialDTO = exports.LevelAccessDTO.partial();
//CREDENTIALS
exports.CredentialAccessDTO = zod_1.z.object({
    name: zod_1.z.string(),
    level_id: zod_1.z.number(),
    description: zod_1.z.optional(zod_1.z.string()).default('Sem Descrição'),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
});
//PARTIAL
exports.CredentialAccessPartialDTO = exports.CredentialAccessDTO.partial();
//MODULES
exports.ModuleAccessDTO = zod_1.z.object({
    name: zod_1.z.string(),
    parent: zod_1.z.number(),
    icon: zod_1.z.string(),
    description: zod_1.z.string(),
    level_security: zod_1.z.number(),
    type: zod_1.z.number(),
    order: zod_1.z.number(),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
});
//PARTIAL
exports.ModuleAccessPartialDTO = exports.ModuleAccessDTO.partial();
