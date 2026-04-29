import { createApiClient, createAuthApi, createUserApi, createPatientApi, createTemplateApi, createReportApi, createSessionApi } from "@workspace/api-client";

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
});

export const authApi = createAuthApi(apiClient);
export const userApi = createUserApi(apiClient);
export const patientApi = createPatientApi(apiClient);
export const templateApi = createTemplateApi(apiClient);
export const reportApi = createReportApi(apiClient);
export const sessionApi = createSessionApi(apiClient);
