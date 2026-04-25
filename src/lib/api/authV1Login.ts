import { authApiClient } from "@/lib/api/authApiClient";

export type AuthV1LoginBody = {
  username: string;
  password: string;
  force: boolean;
};


export async function postAuthV1Login(
  body: AuthV1LoginBody,
): Promise<unknown> {
  const response = await authApiClient.post("/api/v1/auth/login", body);
  return response;
}
