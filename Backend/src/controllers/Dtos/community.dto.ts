import {z} from 'zod';
export const CommunityMessageDTO = z.object({
  is_student: z.optional(z.literal(1).or(z.literal(0))).default(1),
  answer_message: z.optional(z.number()).default(0),
  user_id: z.optional(z.number()),
  user_photo: z.optional(z.number()).default(0),
  user_name:z.optional(z.string()),
  user_last_message: z.optional(z.number()).default(0),
  message:z.optional(z.string()),
  media: z.optional(z.number()),
  public: z.optional(z.literal(1).or(z.literal(0))).default(1),
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

export const CommunityBlockedMembersDTO = z.object({
  user_block_responsible: z.optional(z.number()),
  member_id: z.optional(z.number()),
  block_audio_message: z.optional(z.literal(1).or(z.literal(0))).default(1),
  block_media_message: z.optional(z.literal(1).or(z.literal(0))).default(1),
  block_message_message: z.optional(z.literal(1).or(z.literal(0))).default(1),
  block_access: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type CommunityBlockedMembersType = z.infer<typeof CommunityBlockedMembersDTO>

export const CommunitySetupDTO = z.object({
  block_audio_message: z.optional(z.literal(1).or(z.literal(0))).default(1),
  block_media_message: z.optional(z.literal(1).or(z.literal(0))).default(1),
  block_message_message: z.optional(z.literal(1).or(z.literal(0))).default(1),
  block_access: z.optional(z.literal(1).or(z.literal(0))).default(1),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type CommunitySetupType = z.infer<typeof CommunitySetupDTO>

