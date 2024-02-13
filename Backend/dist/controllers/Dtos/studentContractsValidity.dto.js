"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentContractValidityDTO = void 0;
//Comments
const zod_1 = require("zod");
exports.StudentContractValidityDTO = zod_1.z.object({
    student_id: zod_1.z.optional(zod_1.z.number()),
    payment_cycle: zod_1.z.optional(zod_1.z.string()),
    expired_in: zod_1.z.optional(zod_1.z.string()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
