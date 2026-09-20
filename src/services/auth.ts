import CallAPI from "@/config/api";
import {
  activateAccountSchema,
  signinSchema,
  signupSchema,
} from "@/lib/schema";
import z from "zod";

export async function postLogin(data: z.infer<typeof signinSchema>) {
  const url = `/signin`;

  return CallAPI({ url, method: "POST", data });
}

export async function postRegister(data: z.infer<typeof signupSchema>) {
  const url = `/signup`;

  return CallAPI({ url, method: "POST", data });
}

export async function postLogout(refreshToken: string) {
  const url = `/logout`;

  return CallAPI({ url, method: "POST", data: { refreshToken } });
}

export async function verifyEmail(token: string) {
  const url = `/verify-email`;

  return CallAPI({ url, method: "GET", params: { token } });
}

export async function resendVerifyEmail(email: string) {
  const url = `/resend-verification`;

  return CallAPI({ url, method: "POST", data: { email } });
}

export async function activateAccount(
  token: string,
  data: z.infer<typeof activateAccountSchema>,
) {
  const url = `/activate-account`;

  return CallAPI({ url, method: "POST", data: { token, ...data } });
}
