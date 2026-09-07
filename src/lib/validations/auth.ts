import { z } from "zod";

export const userLoginSchema = z.object({
  username: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export const userSignupSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(80),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username may only contain letters, numbers, and underscores"),
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type UserLoginValues = z.infer<typeof userLoginSchema>;
export type UserSignupValues = z.infer<typeof userSignupSchema>;
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
