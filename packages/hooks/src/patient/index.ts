"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createPatientApi } from "@workspace/api-client/features/patient/api";
import type {
  CreatePatientRequest,
  UpdatePatientRequest,
} from "@workspace/schemas/patient";

type UsePatientsOptions = {
  page?: number
  pageSize?: number
  search?: string
}

export function usePatients(client: ApiClient, options: UsePatientsOptions = {}) {
  const { page = 1, pageSize = 20, search } = options
  // Query key: ["patients", page, pageSize, search]
  const patientApi = createPatientApi(client);
  return useQuery({
    queryFn: () => patientApi.list(page, pageSize, search),
    queryKey: ["patients", page, pageSize, search ?? ""],
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
  const queryClient = useQueryClient();
  const patientApi = createPatientApi(client);
  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useUpdatePatient(client: ApiClient) {
  const queryClient = useQueryClient();
  const patientApi = createPatientApi(client);
  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: string; data: UpdatePatientRequest }) =>
      patientApi.update(patientId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", variables.patientId] });
    },
  });
}

export function useDeletePatient(client: ApiClient) {
  const queryClient = useQueryClient();
  const patientApi = createPatientApi(client);
  return useMutation({
    mutationFn: (patientId: string) => patientApi.delete(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}