import type { ApiClient } from "../../core/client";
import type { CreateReportRequest, UpdateReportRequest, ReportResponse } from "@workspace/schemas/report";

export function createReportApi(client: ApiClient) {
  return {
    create: (data: CreateReportRequest) =>
      client.post<ReportResponse>("/reports", data),

    get: (reportId: string) =>
      client.get<ReportResponse>(`/reports/${reportId}`),

    update: (reportId: string, data: UpdateReportRequest) =>
      client.patch<ReportResponse>(`/reports/${reportId}`, data),

    delete: (reportId: string) =>
      client.delete(`/reports/${reportId}`),
  };
}