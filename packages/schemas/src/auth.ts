import { z } from "zod";

export const userProfileDataSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().max(100).optional(),
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

export const googleRequestSchema = z.object({
  idToken: z.string(),
});

export const onboardingRequestSchema = z.object({
  profile: userProfileDataSchema,
  clinic: clinicDataSchema,
});

export const authResponseSchema = z.object({
  status: z.string(),
  session_token: z.string().optional(),
  onboarding_pending: z.boolean().optional(),
});

export const logoutResponseSchema = z.object({
  status: z.string(),
});

export const setPasswordSchema = z.object({
  password: z.string().min(8),
  confirm_password: z.string().min(8),
});

export const connectProviderSchema = z.object({
  provider: z.enum(["google", "apple", "microsoft"]),
  token: z.string(),
});

export const providerInfoSchema = z.object({
  id: z.string(),
  provider: z.string(),
  email: z.string(),
  is_primary: z.boolean(),
  linked_at: z.string(),
  last_used_at: z.string().nullable(),
});

export const providersListResponseSchema = z.object({
  status: z.string(),
  providers: z.array(providerInfoSchema),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type GoogleRequest = z.infer<typeof googleRequestSchema>;
export type OnboardingRequest = z.infer<typeof onboardingRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type UserProfileData = z.infer<typeof userProfileDataSchema>;
export type ClinicData = z.infer<typeof clinicDataSchema>;
export type SetPasswordRequest = z.infer<typeof setPasswordSchema>;
export type ConnectProviderRequest = z.infer<typeof connectProviderSchema>;
export type ProviderInfo = z.infer<typeof providerInfoSchema>;
export type ProvidersListResponse = z.infer<typeof providersListResponseSchema>;
