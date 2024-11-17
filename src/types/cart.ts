export type Cart = {
  productVariantId: number;
  productName: string;
  productImage: string;
  price: number;
  optionValue: string[];
  quantity: number;
};

export type ExtendedCart = {
  baseProductId: number;
  categoryIds: number[];
  productVariantId: number;
  productName: string;
  productImage: string;
  price: number;
  optionValue: string[];
  quantity: number;
};
