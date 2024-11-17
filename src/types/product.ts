export type BaseProductCategory = {
  id: number;
  slug: string;
  name: string;
};

export type BaseProductBrand = {
  slug: string;
  name: string;
  image: string;
};

export type BaseProductImage = {
  id: number;
  path: string;
  isDefault: boolean;
};

export type BaseProductOptionValues = {
  option: string;
  values: string[];
};

export type BaseProductOptionValue = {
  option: string;
  value: string;
};

export type ProductVariant = {
  id: number;
  categoryIds: number[];
  slug: string;
  name: string;
  variantId: number;
  image: string;
  price: number;
  averageRating: number;
  numberOfReviews: number;
  numberOfPurchases: number;
};

export type BaseProductVariant = {
  id: number;
  image: string;
  quantity: number;
  optionValue: BaseProductOptionValue[];
  price: number;
};

export type BaseProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  categories: BaseProductCategory[];
  brand: BaseProductBrand;
  status: String;
  averageRating: number;
  numberOfReviews: number;
  numberOfPurchases: number;
  images: BaseProductImage[];
  optionValues: BaseProductOptionValues[];
  relatedProducts: ProductVariant[];
  productVariants: BaseProductVariant[];
};
