import { productType } from ".";

export interface CartItem {
  id: string;
  product: productType;
  quantity: number;
  cartVariant: [
    {
      variantValue: {
        variantType: {
          name: string;
        };
        value: string;
      };
    }
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
  order_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  name?: string;
  email?: string;
  price?: number;
  address?: string;
  phone?: string;
  shipping_cost?: number;
  payment_type?: string;
  carts?: {
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      images: {
        image_url?: string;
        isPrimary?: boolean | null;
      }[];
    };
  }[];
}
