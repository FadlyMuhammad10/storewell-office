export interface CartItem {
  id: number;
  qty: number;
  product_variant_id: number;
  product_name: string;
  variant_price: number;
  total_price: number;
  image_url: string;
  variant_stock: number;
  allow_negative_stock: boolean;
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

export interface OrderItem {
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
  details: {
    id: number;
    product_id: number;
    product_variant_id: number;
    product_name: string;
    price: number;
    qty: number;
    subtotal: number;
    image_url: string;
  }[];
}

export interface queryParamsProduct {
  page: number;
  per_page: number;
  search?: string;
  category_id?: number;
}
export interface Product {
  id: number;
  name: string;
  base_price: number;
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
