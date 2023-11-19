import {z} from 'zod';

export const TeacherDTO = z.object({
  date_created:z.optional(z.string()),
  photo:z.optional(z.number()), 
  name:z.optional(z.string()),
  description:z.optional(z.string()), 
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type TeacherType = z.infer<typeof TeacherDTO>;