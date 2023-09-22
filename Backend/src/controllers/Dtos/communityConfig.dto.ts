import {z} from 'zod';
export const WelcomeVideoDTO = z.object({
  idvideo_welcome:z.string(),
  video_platform:z.string(),
})
export type WelcomeVideoType = z.infer<typeof WelcomeVideoDTO>;