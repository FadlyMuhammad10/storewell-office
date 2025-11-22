import CallAPI from "@/config/api";
import { addCartSchema } from "@/lib/schema";
import { CheckoutRequest, CostPayload } from "@/types";
import z from "zod";

export async function GetProducts() {
  const url = `/participant/products`;

  return CallAPI({ url, method: "GET" });
}

export async function GetProductDetail(id: string) {
  const url = `/participant/product/${id}`;

  return CallAPI({ url, method: "GET" });
}

export async function addCart(
  data: z.infer<typeof addCartSchema>,
  token: string
) {
  const url = `/participant/cart`;

  return CallAPI({ url, method: "POST", data, serverToken: token });
}

export async function getCarts(token: string) {
  const url = `/participant/carts`;

  return CallAPI({ url, method: "GET", serverToken: token });
}
export async function getCartsCount(token: string) {
  const url = `/participant/carts/count`;

  return CallAPI({ url, method: "GET", serverToken: token });
}

export async function updateCart(id: number, quantity: number, token: string) {
  const url = `/participant/cart/update/${id}`;

  return CallAPI({
    url,
    method: "PUT",
    data: { quantity },
    serverToken: token,
  });
}

export async function deleteCart(id: number, token: string) {
  const url = `/participant/cart/delete/${id}`;

  return CallAPI({ url, method: "DELETE", serverToken: token });
}

export async function getProvinces(token: string) {
  const url = `/provinces`;

  return CallAPI({ url, method: "GET", serverToken: token });
}
export async function getCities(provinceId: number, token: string) {
  const url = `/cities/${provinceId}`;

  return CallAPI({ url, method: "GET", serverToken: token });
}

export async function getDistricts(cityId: number, token: string) {
  const url = `/districts/${cityId}`;

  return CallAPI({ url, method: "GET", serverToken: token });
}

export async function getCost(data: CostPayload, token: string) {
  const url = `/cost`;

  return CallAPI({ url, method: "POST", data, serverToken: token });
}

export async function postCheckout(data: CheckoutRequest, token: string) {
  const url = `/participant/order/create`;

  return CallAPI({ url, method: "POST", data, serverToken: token });
}
