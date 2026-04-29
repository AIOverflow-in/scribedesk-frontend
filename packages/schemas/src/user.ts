import { z } from "zod";

const clinicDataSchema = z.object({
  name: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  logo_url: z.string().nullable().optional(),
});

export const userResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).nullable().optional(),
  speciality: z.string().nullable().optional(),
  signature_url: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  clinic: clinicDataSchema.nullable(),
});

export const updateProfileRequestSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  speciality: z.string().optional(),
});

export const updateClinicRequestSchema = z.object({
  name: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type UpdateClinicRequest = z.infer<typeof updateClinicRequestSchema>;