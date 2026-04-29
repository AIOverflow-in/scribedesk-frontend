"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "@/lib/api-client";
import type { CreateReportRequest } from "@workspace/schemas/report";
import { toast } from "@workspace/ui/components/sonner";

export function useReport(reportId: string) {
  return useQuery({
    queryFn: () => reportApi.get(reportId),
    queryKey: ["report", reportId],
    enabled: !!reportId,
  });
}

export function useCreateReport() {
  return useMutation({
    mutationFn: (data: CreateReportRequest) => reportApi.create(data),
    onSuccess: () => {
      toast.success("Report generated");
    },
    onError: (error: Error) => {
      toast.error(error instanceof Error ? error.message : "Failed to generate report");
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => reportApi.delete(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Report deleted");
    },
    onError: (error: Error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete report");
    },
  });
}
