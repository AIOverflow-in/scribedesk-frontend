import { z } from "zod";
import { createPaginatedResponseSchema } from "./common";

export const createPatientRequestSchema = z.object({
  full_name: z.string().min(1).max(255),
  identifier: z.string().max(100).optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().max(20).optional(),
  email: z.email().max(255).optional(),
  blood_group: z.string().max(10).optional(),
});

export const updatePatientRequestSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  identifier: z.string().max(100).optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().max(20).optional(),
  email: z.email().max(255).optional(),
  blood_group: z.string().max(10).optional(),
});

export const patientResponseSchema = z.object({
  id: z.uuid(),
  full_name: z.string(),
  identifier: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().optional(),
  blood_group: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const paginatedPatientsResponseSchema = createPaginatedResponseSchema(patientResponseSchema);

export const deletePatientResponseSchema = z.object({
  status: z.string(),
});

export type CreatePatientRequest = z.infer<typeof createPatientRequestSchema>;
export type UpdatePatientRequest = z.infer<typeof updatePatientRequestSchema>;
export type PatientResponse = z.infer<typeof patientResponseSchema>;
export type PaginatedPatientsResponse = z.infer<typeof paginatedPatientsResponseSchema>;
export type DeletePatientResponse = z.infer<typeof deletePatientResponseSchema>;