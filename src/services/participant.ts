import CallAPI from "@/config/api";

export async function GetProducts() {
  const url = `/participant/products`;

  return CallAPI({ url, method: "GET" });
}

export async function GetProductDetail(id: string) {
  const url = `/participant/product/${id}`;

  return CallAPI({ url, method: "GET" });
}
