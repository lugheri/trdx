import {z} from 'zod';
export const WelcomeVideoDTO = z.object({
  idvideo_welcome:z.string(),
  video_platform:z.string(),
})
export type WelcomeVideoType = z.infer<typeof WelcomeVideoDTO>;

export const TextHomeCommunityDTO = z.object({
  title_text:z.string(),
  text:z.string(),
})
export type TextHomeCommunityType = z.infer<typeof TextHomeCommunityDTO>;

export const ButtonHomeCommunityDTO = z.object({
  name:z.string(),
  link:z.string(),
  order:z.optional(z.number()).default(0),
  status:z.optional(z.number()).default(1)
})
export type ButtonHomeCommunityType = z.infer<typeof ButtonHomeCommunityDTO>;