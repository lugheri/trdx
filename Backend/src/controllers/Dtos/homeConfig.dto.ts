import {z} from 'zod';
export const WelcomeVideoDTO = z.object({
  idvideo_welcome:z.string(),
  video_platform:z.string(),
  image_gallery:z.optional(z.number()).default(0),
})
export type WelcomeVideoType = z.infer<typeof WelcomeVideoDTO>;

export const TextHomeDTO = z.object({
  title_text:z.string(),
  text:z.string(),
  additional_text:z.optional(z.string()).default(""),
})
export type TextHomeType = z.infer<typeof TextHomeDTO>;

export const ButtonHomeDTO = z.object({
  type:z.string(),
  icon:z.string(),
  name:z.string(),
  link:z.string(),
  order:z.optional(z.number()).default(0),
  status:z.optional(z.number()).default(1)
})
export type ButtonHomeType = z.infer<typeof ButtonHomeDTO>;

export const SocialMediaDTO = z.object({
  social_media:z.string(),
  text:z.string(),
  link:z.string(),
  order:z.optional(z.number()).default(0),
  status:z.optional(z.number()).default(1)
})
export type SocialMediaType = z.infer<typeof SocialMediaDTO>;