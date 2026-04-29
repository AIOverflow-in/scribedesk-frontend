import type { ApiClient } from "../../core/client";
import type {
  UserResponse,
  UpdateProfileRequest,
  UpdateClinicRequest,
} from "@workspace/schemas/user";

export function createUserApi(client: ApiClient) {
  return {
    getMe: () => client.get<UserResponse>("/users/me"),

    updateProfile: (data: UpdateProfileRequest) =>
      client.patch<UserResponse>("/users/me", data),

    updateClinic: (data: UpdateClinicRequest) =>
      client.patch<UserResponse>("/users/me/clinic", data),
  };
}