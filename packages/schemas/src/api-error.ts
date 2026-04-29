import { z } from "zod";

export const apiErrorDetailSchema = z.object({
  type: z.string(),
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  input: z.unknown().optional(),
  ctx: z.record(z.string(), z.unknown()).optional(),
});

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).nullable().optional(),
  errors: z.array(apiErrorDetailSchema).optional(),
});

export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, unknown>;
  public errors?: z.infer<typeof apiErrorDetailSchema>[];

  constructor(
    status: number,
    data: z.infer<typeof apiErrorSchema> | unknown
  ) {
    const parsed = apiErrorSchema.safeParse(data);
    const error = parsed.success ? parsed.data : { code: "UNKNOWN_ERROR", message: "An unexpected error occurred" };

    super(error.message);
    this.name = "ApiError";
    this.status = status;
    this.code = error.code;
    this.details = error.details ?? undefined;
    this.errors = error.errors;
  }
}

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;