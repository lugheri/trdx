import {z} from 'zod';
import md5 from 'md5';
export const StudentAccessDTO = z.object({
  username:z.string().email('Nome de usuário inválido'),
  password: z.string().min(5,'A senha deve ter mais de 5 dígitos'),
})
export type StudentAccessType = z.infer<typeof StudentAccessDTO>;


export const StudentDTO = z.object({
  comunity:z.optional(z.literal(1).or(z.literal(0))).default(1),
  type:z.optional(z.string()).default('student'),
  photo:z.optional(z.number()),
  name:z.string(),
  mail:z.string().email('O Email não tem um formato válido'),
  born:z.optional(z.string()),
  phone:z.optional(z.string()),
  gender:z.optional(z.string()),
  password:z.string().transform(v=>md5(v)),
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

export const AddCourseStudentDTO = z.object({
  student_id:z.number(),
  course_id:z.number(),
  data_valid:z.optional(z.string()).default('0000-00-00 00:00:00'),
  concluded:z.optional(z.number()).default(0),
  status:z.optional(z.number()).default(1),
})
export type AddCourseStudentType = z.infer<typeof AddCourseStudentDTO>

export const AddContractValidityDTO = z.object({
  student_id:z.number(),
  course_id:z.number(),
  start_validity:z.string(),
  end_validity:z.string(),
  payment_cycle:z.string()
})
export type AddContractValidityType = z.infer<typeof AddContractValidityDTO>


export const PhotoProfileStudentDTO = z.object({
  name_student:z.string(),
  student_id:z.number().or(z.string())
  
})
export type PhotoProfileStudentType = z.infer<typeof PhotoProfileStudentDTO>;



//New File Photo
export const PhotoProfileDTO = z.object({ 
  name:z.string(),
  description:z.optional(z.string()).default('Sem Descrição'),
  file:z.string(),
  extension:z.string(),
  size:z.number(),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type PhotoProfileType = z.infer<typeof PhotoProfileDTO>;

//Optional values for edit functions
export const PhotoProfilePartialDTO = PhotoProfileDTO.partial();
export type PhotoProfilePartialType = z.infer<typeof PhotoProfilePartialDTO>;