import type { ApiClient } from "../../core/client";
import type {
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientResponse,
  PaginatedPatientsResponse,
  DeletePatientResponse,
} from "@workspace/schemas/patient";

export function createPatientApi(client: ApiClient) {
  return {
    list: (page: number = 1, pageSize: number = 20) =>
      client.get<PaginatedPatientsResponse>(
        `/patients?page=${page}&page_size=${pageSize}`
      ),

    get: (patientId: string) =>
      client.get<PatientResponse>(`/patients/${patientId}`),

    create: (data: CreatePatientRequest) =>
      client.post<PatientResponse>("/patients", data),

    update: (patientId: string, data: UpdatePatientRequest) =>
      client.patch<PatientResponse>(`/patients/${patientId}`, data),

    delete: (patientId: string) =>
      client.delete<DeletePatientResponse>(`/patients/${patientId}`),
  };
}