"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherDTO = void 0;
const zod_1 = require("zod");
exports.TeacherDTO = zod_1.z.object({
    date_created: zod_1.z.optional(zod_1.z.string()),
    photo: zod_1.z.optional(zod_1.z.number()),
    name: zod_1.z.optional(zod_1.z.string()),
    description: zod_1.z.optional(zod_1.z.string()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
