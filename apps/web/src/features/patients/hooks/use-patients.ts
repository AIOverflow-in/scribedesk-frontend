"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { patientApi } from "@/lib/api-client";
import type { CreatePatientRequest, UpdatePatientRequest } from "@workspace/schemas";

type UsePatientsOptions = {
  page?: number
  pageSize?: number
  search?: string
}

export function usePatients(options: UsePatientsOptions = {}) {
  const { page = 1, pageSize = 20, search } = options
  return useQuery({
    queryFn: () => patientApi.list(page, pageSize, search),
    queryKey: ["patients", page, pageSize, search ?? ""],
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
