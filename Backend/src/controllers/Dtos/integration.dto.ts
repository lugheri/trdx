import {z} from 'zod';

export const IntegrationPlatformDTO = z.object({
  date:z.optional(z.string()),
  name:z.optional(z.string()),
  url:z.optional(z.string()),
  description:z.optional(z.string()),
  ready:z.optional(z.literal(1).or(z.literal(0))).default(0),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type IntegrationPlatformType = z.infer<typeof IntegrationPlatformDTO>;

export const IntegrationProductDTO = z.object({
  integration:z.optional(z.string()),
  product_id_platform:z.optional(z.string()),
  community_access:z.optional(z.literal(1).or(z.literal(0))).default(0),
  name:z.optional(z.string()),
  active:z.optional(z.literal(1).or(z.literal(0))).default(1),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1),
})
export type IntegrationProductType = z.infer<typeof IntegrationProductDTO>;

export const IntegrationOfferDTO = z.object({
  product_id:z.optional(z.number()),
  offer:z.optional(z.string()),
  description:z.optional(z.string()),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1),
})
export type IntegrationOfferType = z.infer<typeof IntegrationOfferDTO>;

export const IntegrationCoursesDTO = z.object({
  product_id:z.optional(z.number()),
  offer_id:z.optional(z.number()),
  course_id_students:z.optional(z.number()),
  validity_contract:z.optional(z.string())
})
export type IntegrationCoursesType = z.infer<typeof IntegrationCoursesDTO>;