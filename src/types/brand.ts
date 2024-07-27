export type BrandProduct = {
  id: number;
  slug: string;
  name: string;
  variantId: number;
  image: string;
  price: number;
  averageRating: number;
  numberOfReviews: number;
  numberOfPurchases: number;
};

export type Brand = {
  id: number;
  slug: string;
  name: string;
  image: string;
  products: BrandProduct[];
};
