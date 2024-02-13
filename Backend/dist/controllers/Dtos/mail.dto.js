"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMailDTO = exports.MailAccountDTO = void 0;
const zod_1 = require("zod");
exports.MailAccountDTO = zod_1.z.object({
    date: zod_1.z.optional(zod_1.z.string()),
    name: zod_1.z.optional(zod_1.z.string()),
    host: zod_1.z.optional(zod_1.z.string()),
    port: zod_1.z.optional(zod_1.z.number()),
    secure: zod_1.z.optional(zod_1.z.number()),
    user: zod_1.z.optional(zod_1.z.string()),
    pass: zod_1.z.optional(zod_1.z.string()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
exports.SendMailDTO = zod_1.z.object({
    accountId: zod_1.z.number(),
    from: zod_1.z.string(),
    mailTo: zod_1.z.string(),
    copy: zod_1.z.optional(zod_1.z.string()),
    hiddenCopy: zod_1.z.optional(zod_1.z.string()),
    subject: zod_1.z.string(),
    body: zod_1.z.string()
});
