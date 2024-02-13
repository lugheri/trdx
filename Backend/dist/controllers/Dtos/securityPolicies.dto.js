"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubModulesDTO = exports.GetModulesDTO = exports.CheckAccessDTO = void 0;
const zod_1 = require("zod");
exports.CheckAccessDTO = zod_1.z.object({
    moduleId: zod_1.z.string().transform((value) => Number(value)),
    levelId: zod_1.z.string().transform((value) => Number(value))
});
exports.GetModulesDTO = zod_1.z.object({
    type: zod_1.z.string(),
    moduleParentId: zod_1.z.string().transform((value) => Number(value)),
    levelId: zod_1.z.string().transform((value) => Number(value))
});
exports.GetSubModulesDTO = zod_1.z.object({
    type: zod_1.z.string(),
    module: zod_1.z.string(),
    levelId: zod_1.z.string().transform((value) => Number(value))
});
