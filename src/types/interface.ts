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
