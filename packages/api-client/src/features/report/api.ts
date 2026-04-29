import type { ApiClient } from "../../core/client";
import type { CreateReportRequest, ReportResponse } from "@workspace/schemas/report";

export function createReportApi(client: ApiClient) {
  return {
    create: (data: CreateReportRequest) =>
      client.post<ReportResponse>("/reports", data),

    get: (reportId: string) =>
      client.get<ReportResponse>(`/reports/${reportId}`),
  };
}