"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createPatientApi } from "@workspace/api-client/features/patient/api";
import type {
  CreatePatientRequest,
  UpdatePatientRequest,
} from "@workspace/schemas/patient";

export function usePatients(client: ApiClient, page: number = 1, pageSize: number = 20) {
  // Query key: ["patients", page, pageSize]
  const patientApi = createPatientApi(client);
  return useQuery({
    queryFn: () => patientApi.list(page, pageSize),
    queryKey: ["patients", page, pageSize],
  });
}

export function usePatient(client: ApiClient, patientId: string) {
  // Query key: ["patient", patientId]
  const patientApi = createPatientApi(client);
  return useQuery({
    queryFn: () => patientApi.get(patientId),
    queryKey: ["patient", patientId],
    enabled: !!patientId,
  });
}

export function useCreatePatient(client: ApiClient) {
  // Mutation - invalidate ["patients"] on success at app level
  const patientApi = createPatientApi(client);
  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientApi.create(data),
  });
}

export function useUpdatePatient(client: ApiClient) {
  // Mutation - invalidate ["patients"] and ["patient", id] on success at app level
  const patientApi = createPatientApi(client);
  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: string; data: UpdatePatientRequest }) =>
      patientApi.update(patientId, data),
  });
}

export function useDeletePatient(client: ApiClient) {
  // Mutation - invalidate ["patients"] on success at app level
  const patientApi = createPatientApi(client);
  return useMutation({
    mutationFn: (patientId: string) => patientApi.delete(patientId),
  });
}