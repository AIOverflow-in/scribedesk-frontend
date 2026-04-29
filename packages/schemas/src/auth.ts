import { z } from "zod";

export const userProfileDataSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().max(100).optional(),
  dob: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  speciality: z.string().max(100).optional(),
});

export const clinicDataSchema = z.object({
  name: z.string().min(1).max(255),
  street: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),
  country: z.string().length(2).regex(/^[A-Z]{2}$/),
});

export const registerRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  profile: userProfileDataSchema,
  clinic: clinicDataSchema,
});

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const authResponseSchema = z.object({
  status: z.string(),
  session_token: z.string().optional(),
});

export const logoutResponseSchema = z.object({
  status: z.string(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type UserProfileData = z.infer<typeof userProfileDataSchema>;
export type ClinicData = z.infer<typeof clinicDataSchema>;