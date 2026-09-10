export interface CartItem {
  id: number;
  qty: number;
  product_variant_id: number;
  product_name: string;
  variant_price: number;
  final_price?: number;
  discount?: {
    id: number;
    name: string;
    type: string;
    value: number;
  };
  total_price: number;
  image_url: string;
  variant_stock: number;
  allow_negative_stock: boolean;
  can_purchase?: boolean;
  unavailable_reason?: string | null;
  combinations: [
    {
      product_variant_option_value_id: number;
      variant_value_id: number;
      variant_value_name: string;
    },
  ];
}

export interface ProvinceItem {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  rajaongkir_id?: null;
}
export interface CityItem {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  province_id: number;
  rajaongkir_id?: null;
}
export interface DistrictItem {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  city_id: number;
  rajaongkir_id?: null;
}

export interface CostItem {
  service: string;
  description: string;
  cost: number;
  etd?: string;
}

export interface OrderRes {
  id: number;
  order_code: string;
  status: string;
  process_status: string;
  final_amount: number;
  order_date: string;
  items: Array<{
    id: number;
    product_name: string;
    image_url: string | null;
  }>;
}

export interface OrderDetailResponse {
  id: number;
  product_id: number;
  product_variant_id: number | null;
  product_name: string;
  price: number;
  final_price: number;
  qty: number;
  subtotal: number;
  image_url: string | null;
  variants: Array<{
    variant_type_name: string;
    variant_value_name: string;
  }>;
}

export interface ShowOrderDetailResponse {
  id: number;
  order_code: string;
  status: string;
  process_status: string;
  final_amount: number;
  nominal_amount: number;
  order_date: string;
  email: string;
  full_name: string;
  address: string;
  phone_number: string;
  transaction_time: string;
  payment_type: string;
  expiry_at: string;
  details: OrderDetailResponse[];
}

export interface queryParamsProduct {
  page: number;
  per_page: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  brand_ids?: string;
  sort_by?: "created_at" | "price";
  sort_order?: "asc" | "desc";
}

export interface ProductFacetQuery {
  search?: string;
  category_id?: number;
  brand_id?: number;
  brand_ids?: string;
}

export interface ProductFacetBrand {
  id: number;
  name: string;
  count: number;
}

export interface ProductFacetCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  children: ProductFacetCategory[];
}

export interface ProductFacets {
  brands: ProductFacetBrand[];
  categories: ProductFacetCategory[];
}
export interface queryParamsOrder {
  page: number;
  per_page: number;
  search?: string;
  status_shipment?: string;
}
export interface Product {
  id: number;
  name: string;
  base_price: number;
  final_price?: number;
  discount?: {
    id: number;
    name: string;
    type: string;
    value: number;
  };
  product_category_id: number;
  category_name: string;
  images: [
    {
      id: number;
      image_url: string;
      is_primary: boolean;
    },
  ];
}
