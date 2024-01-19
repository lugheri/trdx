//Comments
import {z} from 'zod';
export const StudentContractValidityDTO = z.object({  
  student_id:z.optional(z.number()),
  payment_cycle:z.optional(z.string()),
  expired_in:z.optional(z.string()),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type StudentContractValidityType = z.infer<typeof StudentContractValidityDTO>