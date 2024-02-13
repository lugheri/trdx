"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoProfilePartialDTO = exports.PhotoProfileDTO = exports.PhotoProfileStudentDTO = exports.AddContractValidityDTO = exports.AddCourseStudentDTO = exports.SearchStudentDTO = exports.PaginationStudentDTO = exports.StudentPartialDTO = exports.StudentDTO = exports.StudentAccessDTO = void 0;
const zod_1 = require("zod");
const md5_1 = __importDefault(require("md5"));
exports.StudentAccessDTO = zod_1.z.object({
    username: zod_1.z.string().email('Nome de usuário inválido'),
    password: zod_1.z.string().min(5, 'A senha deve ter mais de 5 dígitos'),
});
exports.StudentDTO = zod_1.z.object({
    community: zod_1.z.optional(zod_1.z.number()).default(1),
    type: zod_1.z.optional(zod_1.z.string()).default('student'),
    photo: zod_1.z.optional(zod_1.z.number()),
    name: zod_1.z.string(),
    mail: zod_1.z.string().email('O Email não tem um formato válido'),
    born: zod_1.z.optional(zod_1.z.string()),
    phone: zod_1.z.optional(zod_1.z.string()),
    gender: zod_1.z.optional(zod_1.z.string()),
    password: zod_1.z.string().transform(v => (0, md5_1.default)(v)),
    reset: zod_1.z.optional(zod_1.z.number()).default(1),
    status: zod_1.z.optional(zod_1.z.number()).default(1)
});
exports.StudentPartialDTO = exports.StudentDTO.partial();
exports.PaginationStudentDTO = zod_1.z.object({
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    page: zod_1.z.optional(zod_1.z.number()).default(1),
    order: zod_1.z.optional(zod_1.z.enum(['ASC', 'DESC'])).default('ASC'),
    orderedBy: zod_1.z.optional(zod_1.z.string()).default('id'),
});
exports.SearchStudentDTO = zod_1.z.object({
    params: zod_1.z.string(),
    value: zod_1.z.string(),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    page: zod_1.z.optional(zod_1.z.number()).default(1),
    order: zod_1.z.optional(zod_1.z.enum(['ASC', 'DESC'])).default('ASC'),
    orderedBy: zod_1.z.optional(zod_1.z.string()).default('id'),
});
exports.AddCourseStudentDTO = zod_1.z.object({
    student_id: zod_1.z.number(),
    course_id: zod_1.z.number(),
    data_valid: zod_1.z.optional(zod_1.z.string()).default('0000-00-00 00:00:00'),
    concluded: zod_1.z.optional(zod_1.z.number()).default(0),
    status: zod_1.z.optional(zod_1.z.number()).default(1),
});
exports.AddContractValidityDTO = zod_1.z.object({
    student_id: zod_1.z.number(),
    course_id: zod_1.z.number(),
    start_validity: zod_1.z.string(),
    end_validity: zod_1.z.string(),
    payment_cycle: zod_1.z.string()
});
exports.PhotoProfileStudentDTO = zod_1.z.object({
    name_student: zod_1.z.string(),
    student_id: zod_1.z.number().or(zod_1.z.string())
});
//New File Photo
exports.PhotoProfileDTO = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()).default('Sem Descrição'),
    file: zod_1.z.string(),
    extension: zod_1.z.string(),
    size: zod_1.z.number(),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
//Optional values for edit functions
exports.PhotoProfilePartialDTO = exports.PhotoProfileDTO.partial();
