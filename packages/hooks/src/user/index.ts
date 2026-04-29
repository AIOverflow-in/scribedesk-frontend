"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createUserApi } from "@workspace/api-client/features/user/api";
import type { UpdateProfileRequest, UpdateClinicRequest } from "@workspace/schemas/user";

export function useCurrentUser(client: ApiClient) {
  // Query key: ["currentUser"]
  const userApi = createUserApi(client);
  return useQuery({
    queryFn: () => userApi.getMe(),
    queryKey: ["currentUser"],
  });
}

export function useUpdateProfile(client: ApiClient) {
  // Mutation - invalidate ["currentUser"] on success at app level
  const userApi = createUserApi(client);
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
  });
}

export function useUpdateClinic(client: ApiClient) {
  // Mutation - invalidate ["currentUser"] on success at app level
  const userApi = createUserApi(client);
  return useMutation({
    mutationFn: (data: UpdateClinicRequest) => userApi.updateClinic(data),
  });
}