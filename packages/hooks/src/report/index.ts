"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createReportApi } from "@workspace/api-client/features/report/api";
import type { CreateReportRequest } from "@workspace/schemas/report";

export function useReport(client: ApiClient, reportId: string) {
  // Query key: ["report", reportId]
  const reportApi = createReportApi(client);
  return useQuery({
    queryFn: () => reportApi.get(reportId),
    queryKey: ["report", reportId],
    enabled: !!reportId,
  });
}

export function useCreateReport(client: ApiClient) {
  // Mutation - invalidate reports list on success at app level (if needed)
  const reportApi = createReportApi(client);
  return useMutation({
    mutationFn: (data: CreateReportRequest) => reportApi.create(data),
  });
}