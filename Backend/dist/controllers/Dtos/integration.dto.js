"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCopyDTO = exports.IntegrationCoursesDTO = exports.IntegrationOfferDTO = exports.IntegrationProductDTO = exports.IntegrationPlatformDTO = exports.PaginationHooksDTO = exports.IntegrationHookDTO = void 0;
const zod_1 = require("zod");
exports.IntegrationHookDTO = zod_1.z.object({
    product_id: zod_1.z.optional(zod_1.z.number()),
    product_name: zod_1.z.optional(zod_1.z.string()),
    integration: zod_1.z.optional(zod_1.z.string()),
    offer: zod_1.z.optional(zod_1.z.string()),
    pay_status: zod_1.z.optional(zod_1.z.string()),
    student_name: zod_1.z.optional(zod_1.z.string()),
    student_mail: zod_1.z.optional(zod_1.z.string()),
    data_post: zod_1.z.optional(zod_1.z.string()),
});
exports.PaginationHooksDTO = zod_1.z.object({
    params: zod_1.z.string(),
    value: zod_1.z.string(),
    page: zod_1.z.optional(zod_1.z.number()).default(1),
    order: zod_1.z.optional(zod_1.z.enum(['ASC', 'DESC'])).default('ASC'),
    orderedBy: zod_1.z.optional(zod_1.z.string()).default('id'),
});
exports.IntegrationPlatformDTO = zod_1.z.object({
    date: zod_1.z.optional(zod_1.z.string()),
    name: zod_1.z.optional(zod_1.z.string()),
    url: zod_1.z.optional(zod_1.z.string()),
    description: zod_1.z.optional(zod_1.z.string()),
    ready: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(0),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
exports.IntegrationProductDTO = zod_1.z.object({
    integration: zod_1.z.optional(zod_1.z.string()),
    product_id_platform: zod_1.z.optional(zod_1.z.string()),
    community_access: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(0),
    name: zod_1.z.optional(zod_1.z.string()),
    active: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
});
exports.IntegrationOfferDTO = zod_1.z.object({
    product_id: zod_1.z.optional(zod_1.z.number()),
    offer: zod_1.z.optional(zod_1.z.string()),
    description: zod_1.z.optional(zod_1.z.string()),
    email_copy: zod_1.z.optional(zod_1.z.number()).default(0),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
});
exports.IntegrationCoursesDTO = zod_1.z.object({
    product_id: zod_1.z.optional(zod_1.z.number()),
    offer_id: zod_1.z.optional(zod_1.z.number()),
    course_id_students: zod_1.z.optional(zod_1.z.number()),
    validity_contract: zod_1.z.optional(zod_1.z.string())
});
exports.EmailCopyDTO = zod_1.z.object({
    title: zod_1.z.optional(zod_1.z.string()),
    subject: zod_1.z.optional(zod_1.z.string()),
    body: zod_1.z.optional(zod_1.z.string()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
});
