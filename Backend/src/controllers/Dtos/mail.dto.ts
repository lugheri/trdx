import {z} from 'zod';

export const MailAccountDTO = z.object({
  date:z.optional(z.string()),
  name:z.optional(z.string()),
  host:z.optional(z.string()),
  port:z.optional(z.number()),
  secure:z.optional(z.number()),
  user:z.optional(z.string()),
  pass:z.optional(z.string()),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type MailAccountType = z.infer<typeof MailAccountDTO>;

export const SendMailDTO = z.object({
  accountId:z.number(),
  from:z.string(),
  mailTo:z.string(),
  copy:z.optional(z.string()),
  hiddenCopy:z.optional(z.string()),
  subject:z.string(),
  body:z.string()
})
export type SendMailType = z.infer<typeof SendMailDTO>;
