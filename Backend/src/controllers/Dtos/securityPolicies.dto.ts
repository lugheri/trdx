import { z } from 'zod';

export const CheckAccessDTO = z.object({
  moduleId: z.string().transform((value) => Number(value)),
  levelId: z.string().transform((value) => Number(value))
})

export const GetModulesDTO = z.object({
  type: z.string(),
  moduleParentId: z.string().transform((value) => Number(value)),
  levelId: z.string().transform((value) => Number(value))
})
export type GetModulesType = z.infer<typeof GetModulesDTO>

export const GetSubModulesDTO = z.object({
  type: z.string(),
  module: z.string(),
  levelId: z.string().transform((value) => Number(value))
})
export type GetSubModulesType = z.infer<typeof GetSubModulesDTO>