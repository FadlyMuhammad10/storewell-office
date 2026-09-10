import CallAPI from "@/config/api";
import { addCartSchema } from "@/lib/schema";
import {
  CheckoutRequest,
  CostPayload,
  CreatePaymentRequest,
  ParticipantBrandQuery,
} from "@/types";
import {
  ProductFacetQuery,
  queryParamsOrder,
  queryParamsProduct,
} from "@/types/interface";
import z from "zod";

export async function GetCategories() {
  const url = `/participant/categories`;

  return CallAPI({ url, method: "GET" });
}
export async function GetCategoriesTree() {
  const url = `/participant/categories/tree`;

  return CallAPI({ url, method: "GET" });
}
export async function GetCategoriesRoot() {
  const url = `/participant/categories/root`;

  return CallAPI({ url, method: "GET" });
}
export async function GetDataBrands(params?: ParticipantBrandQuery) {
  const url = `/participant/brands`;

  return CallAPI({ url, method: "GET", params });
}
export async function GetProductsFacets(params?: ProductFacetQuery) {
  const url = `/participant/products/facets`;

  return CallAPI({ url, method: "GET", params });
}

export async function GetProducts(params: queryParamsProduct) {
  const url = `/participant/products`;

  return CallAPI({ url, method: "GET", params });
}

export async function GetProductDetail(id: string) {
  const url = `/participant/product/${id}`;

  return CallAPI({ url, method: "GET" });
}

export async function addCart(
  data: z.infer<typeof addCartSchema>,
  token: string,
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
  const url = `/rajaongkir/province`;

  return CallAPI({ url, method: "GET", serverToken: token });
}
export async function getCities(provinceId: number, token: string) {
  const url = `/rajaongkir/city/${provinceId}`;

  return CallAPI({ url, method: "GET", serverToken: token });
}

export async function getDistricts(cityId: number, token: string) {
  const url = `/rajaongkir/district/${cityId}`;

  return CallAPI({ url, method: "GET", serverToken: token });
}

export async function getCost(data: CostPayload, token: string) {
  const url = `/rajaongkir/shipping-cost`;

  return CallAPI({ url, method: "POST", data, serverToken: token });
}

export async function postCheckout(data: CheckoutRequest, token: string) {
  const url = `/participant/order/create`;

  return CallAPI({ url, method: "POST", data, serverToken: token });
}
export async function postPayment(data: CreatePaymentRequest, token: string) {
  const url = `/participant/payment/create`;

  return CallAPI({ url, method: "POST", data, serverToken: token });
}

export async function getOrders(token: string, params: queryParamsOrder) {
  const url = `/participant/orders`;

  return CallAPI({ url, method: "GET", serverToken: token, params });
}

export async function detailOrder(id: string, token: string) {
  const url = `/participant/order/detail/${id}`;

  return CallAPI({ url, method: "GET", serverToken: token });
}
