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
