import {z} from 'zod';

export const StudentDTO = z.object({
  comunity:z.optional(z.literal(1).or(z.literal(0))).default(1),
  type:z.optional(z.string()).default('student'),
  name:z.string(),
  mail:z.string().email('O Email não tem um formato válido'),
  born:z.optional(z.string()),
  phone:z.optional(z.string()),
  gender:z.optional(z.string()),
  password:z.string(),
  reset:z.optional(z.number()).default(1),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type StudentType = z.infer<typeof StudentDTO>;

export const StudentPartialDTO = StudentDTO.partial();
export type StudentPartialType = z.infer<typeof StudentPartialDTO>;

export const PaginationStudentDTO = z.object({
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
  page: z.optional(z.number()).default(1),
  order: z.optional(z.enum(['ASC','DESC'])).default('ASC'),
  orderedBy: z.optional(z.string()).default('id'),
})
export type PaginationStudentType = z.infer<typeof PaginationStudentDTO>

export const SearchStudentDTO = z.object({
  params: z.string(),
  value:z.string(),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
  page: z.optional(z.number()).default(1),
  order: z.optional(z.enum(['ASC','DESC'])).default('ASC'),
  orderedBy: z.optional(z.string()).default('id'),
})
export type SearchStudentType = z.infer<typeof SearchStudentDTO>

