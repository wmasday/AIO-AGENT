import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  plan: z.enum(['free', 'team']),
});

export function parseSignup(body) {
  const result = signupSchema.safeParse(body);
  if (!result.success) {
    return { ok: false, errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`) };
  }
  return { ok: true, value: result.data };
}
