import { z } from "zod";
import md5 from 'md5';
//Auth 
export const UserAccessDTO = z.object({
  username: z.string().email('Nome de usuário inválido'),
  password: z.string().min(5,'A senha deve ter mais de 5 dígitos'),
});
export type UserAccessType = z.infer<typeof UserAccessDTO>;

//USERS
export const UserDataDTO = z.object({
  photo: z.optional(z.number()).default(0),
  name:z.string(),
  mail:z.string(),
  credential: z.number(),
  password:z.string().transform(v=>md5(v)),
  reset: z.optional(z.number()).default(1),
  logged: z.optional(z.number()).default(0),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
})
export type UserDataType = z.infer<typeof UserDataDTO>;
export const UserDataPartialDTO = UserDataDTO.partial();
export type UserDataPartialType = z.infer<typeof UserDataPartialDTO>;

export const PhotoProfileUserDTO = z.object({
  name:z.string(),
  user_id:z.number().or(z.string())  
})
export type PhotoProfileUserType = z.infer<typeof PhotoProfileUserDTO>;

export const PaginationUserDTO = z.object({
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
  page: z.optional(z.number()).default(1),
  order: z.optional(z.enum(['ASC','DESC'])).default('ASC'),
  orderedBy: z.optional(z.string()).default('id'),
})  
export type PaginationUserType = z.infer<typeof PaginationUserDTO>;

//LEVELS
export const LevelAccessDTO = z.object({
  name:z.string(),
  description: z.optional(z.string()).default('Sem Descrição'),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
})
export type LevelAccessType = z.infer<typeof LevelAccessDTO>;
//PARTIAL
export const LevelAccessPartialDTO = LevelAccessDTO.partial();
export type LevelAccessPartialType = z.infer<typeof LevelAccessPartialDTO>;

//CREDENTIALS
export const CredentialAccessDTO = z.object({
  name:z.string(),
  level_id: z.number(),
  description: z.optional(z.string()).default('Sem Descrição'),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
})
export type CredentialAccessType = z.infer<typeof CredentialAccessDTO>;
//PARTIAL
export const CredentialAccessPartialDTO = CredentialAccessDTO.partial();
export type CredentialAccessPartialType = z.infer<typeof CredentialAccessPartialDTO>;


//MODULES
export const ModuleAccessDTO = z.object({
  name:z.string(),
  parent: z.number(),
  icon:z.string(),
  description:z.string(),
  level_security: z.number(),
  type: z.number(),
  order: z.number(),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
})
export type ModuleAccessType = z.infer<typeof ModuleAccessDTO>;
//PARTIAL
export const ModuleAccessPartialDTO = ModuleAccessDTO.partial();
export type ModuleAccessPartialType = z.infer<typeof ModuleAccessPartialDTO>;