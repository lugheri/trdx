"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationGalleryDTO = exports.FileGalleryPartialDTO = exports.GalleryDTO = exports.FileGalleryDTO = exports.FolderPartialDTO = exports.FolderDTO = void 0;
const zod_1 = require("zod");
//DTO FROM FOLDERS
exports.FolderDTO = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
//Optional values for edit functions
exports.FolderPartialDTO = exports.FolderDTO.partial();
//DTO from Filter Gallery
exports.FileGalleryDTO = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()).default('Sem Descrição'),
    folder: zod_1.z.optional(zod_1.z.string()).default('0'),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
//New File Gallery
exports.GalleryDTO = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()).default('Sem Descrição'),
    file: zod_1.z.string(),
    extension: zod_1.z.string(),
    size: zod_1.z.number(),
    folder: zod_1.z.optional(zod_1.z.string()).default('0'),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
//Optional values for edit functions
exports.FileGalleryPartialDTO = exports.FileGalleryDTO.partial();
exports.PaginationGalleryDTO = zod_1.z.object({
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    page: zod_1.z.optional(zod_1.z.number()).default(1),
    order: zod_1.z.optional(zod_1.z.enum(['ASC', 'DESC'])).default('ASC'),
    orderedBy: zod_1.z.optional(zod_1.z.string()).default('id'),
});
