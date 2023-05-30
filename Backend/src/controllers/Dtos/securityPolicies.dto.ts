import { z } from 'zod';

export const CheckAccessDTO = z.object({
  moduleId: z.string().transform((value) => Number(value)),
  levelId: z.string().transform((value) => Number(value))
})
export type CheckAccessType = z.infer<typeof CheckAccessDTO>