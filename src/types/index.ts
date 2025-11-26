import { checkoutSchema } from "@/lib/schema";
import z from "zod";

export type categoryType = {
  id: number;
  name: string;
};

export type imageType = {
  image_url?: string;
  isPrimary?: boolean | null;
};
export type variantType = {
  id: number;
  name: string;
  type: string;
  values?: variantValueType[];
};
export type variantValueType = {
  id: number;
  variantTypeId: number;
  value: string;
  hexCode?: string;
};

export type productType = {
  id: number;
  name: string;
  price?: number;
  description?: string;
  stock?: number;
  status?: boolean;
  category?: categoryType;
  images?: imageType[];
  variants?: variantType[];
};

type Variant = {
  variantTypeId: number;
  name: string;
  valueId: number;
  value: string;
};

export type SelectedVariants = {
  variants: Variant[];
};

export type CostPayload = {
  origin: number;
  destination: number;
  weight: number;
  courier?: string;
};

export type CheckoutRequest = z.infer<typeof checkoutSchema> & {
  cart_item: number[];
  origin_id: number;
  gross_amount: number;
  destination_id: number;
  shipping_cost?: number;
  weight?: number;
  courier?: string;
  courier_service?: string;
  province_name?: string;
  city_name?: string;
  district_name?: string;
};
