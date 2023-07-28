import {z} from 'zod';

//DTO from Filter Gallery
export const PaginationGalleryDTO = z.object({
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
  page: z.optional(z.number()).default(1),
  order: z.optional(z.enum(['ASC','DESC'])).default('ASC'),
  orderedBy: z.optional(z.string()).default('id'),
})
export type PaginationGalleryTypes = z.infer<typeof PaginationGalleryDTO>