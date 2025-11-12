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
