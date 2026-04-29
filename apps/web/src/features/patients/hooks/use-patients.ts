"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { patientApi } from "@/lib/api-client";
import type { CreatePatientRequest, UpdatePatientRequest } from "@workspace/schemas";

export function usePatients(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryFn: () => patientApi.list(page, pageSize),
    queryKey: ["patients", page, pageSize],
  });
}

export function usePatient(patientId: string) {
  return useQuery({
    queryFn: () => patientApi.get(patientId),
    queryKey: ["patient", patientId],
    enabled: !!patientId,
  });
}

export function useCreatePatient() {
  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientApi.create(data),
  });
}

export function useUpdatePatient() {
  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: string; data: UpdatePatientRequest }) =>
      patientApi.update(patientId, data),
  });
}

export function useDeletePatient() {
  return useMutation({
    mutationFn: (patientId: string) => patientApi.delete(patientId),
  });
}
