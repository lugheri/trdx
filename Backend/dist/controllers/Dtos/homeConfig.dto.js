"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediaDTO = exports.ButtonHomeDTO = exports.TextHomeDTO = exports.WelcomeVideoDTO = void 0;
const zod_1 = require("zod");
exports.WelcomeVideoDTO = zod_1.z.object({
    idvideo_welcome: zod_1.z.string(),
    video_platform: zod_1.z.string(),
    image_gallery: zod_1.z.optional(zod_1.z.number()).default(0),
});
exports.TextHomeDTO = zod_1.z.object({
    title_text: zod_1.z.string(),
    text: zod_1.z.string()
});
exports.ButtonHomeDTO = zod_1.z.object({
    type: zod_1.z.string(),
    icon: zod_1.z.string(),
    name: zod_1.z.string(),
    link: zod_1.z.string(),
    order: zod_1.z.optional(zod_1.z.number()).default(0),
    status: zod_1.z.optional(zod_1.z.number()).default(1)
});
exports.SocialMediaDTO = zod_1.z.object({
    social_media: zod_1.z.string(),
    text: zod_1.z.string(),
    link: zod_1.z.string(),
    order: zod_1.z.optional(zod_1.z.number()).default(0),
    status: zod_1.z.optional(zod_1.z.number()).default(1)
});
