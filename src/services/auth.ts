import CallAPI from "@/config/api";
import { signinSchema, signupSchema } from "@/lib/schema";
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
