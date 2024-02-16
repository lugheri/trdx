import {z} from 'zod';
export const CommunityMessageDTO = z.object({
  is_student: z.optional(z.literal(1).or(z.literal(0))).default(1),
  user_id: z.optional(z.number()),
  user_photo: z.optional(z.number()).default(0),
  user_name:z.optional(z.string()),
  user_last_message: z.optional(z.number()).default(0),
  message:z.optional(z.string()),
  media: z.optional(z.number()),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type CommunityMessageType = z.infer<typeof CommunityMessageDTO>

export const CommunityMediaDTO = z.object({
  user_id: z.optional(z.number()),
  file:z.optional(z.string()),
  type_media:z.optional(z.string()),
  duration:z.optional(z.number()).default(0),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type CommunityMediaType = z.infer<typeof CommunityMediaDTO>

export const CommunityStickerDTO = z.object({
  name: z.optional(z.string()),
  description: z.optional(z.string()),
  file: z.optional(z.string()),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type CommunityStickerType = z.infer<typeof CommunityStickerDTO>