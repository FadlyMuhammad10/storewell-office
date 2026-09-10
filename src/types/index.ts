export type categoryType = {
  id: number;
  name: string;
  image_url: string | null;
};

export interface RootCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface ParticipantBrandResponse {
  id: number;
  name: string;
  is_active: boolean;
  countProduct: number;
}

export interface ParticipantBrandQuery {
  search?: string;
}

export type CategoryTree = categoryType & {
  parent_id: number | null;
  slug: string;
  public_id: string | null;
  children: CategoryTree[];
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
  base_price: number;
  final_price?: number;
  discount?: {
    id: number;
    name: string;
    type: string;
    value: number;
  };
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

export type CheckoutRequest = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  nominal_amount: number;
  postal_code: string;
  final_amount: number;
  cart_items?: [
    {
      cart_id: number;
    },
  ];
};

export type CreatePaymentRequest = {
  order_code: string;
};

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  base_price: number;
  final_price?: number;
  discount?: {
    id: number;
    name: string;
    type: string;
    value: number;
  };
  is_sale: boolean;
  allow_negative_stock: boolean;
  product_unit_id: number;
  unit_name: string;
  product_category_id: number;
  category_name: string;
  images: [
    {
      id: number;
      image_url: string;
      is_primary: boolean;
    },
  ];
  variants: [
    {
      variant_type_id: number;
      variant_type_is_visible: boolean;
      variant_type_name: string;
      values: [
        {
          variant_value_id: number;
          variant_value_is_visible: boolean;
          variant_value_name: string;
        },
      ];
    },
  ];
  combinations: [
    {
      product_variant_id: number;
      price: number;
      stock: number;
      is_visible: boolean;
      option_value_ids: number[];
      can_purchase?: boolean;
    },
  ];
}
