import { CategoryProduct } from "@/types/category";
import { ProductVariant } from "@/types/product";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const name = process.env.COOKIES_FAVORITE_PRODUCTS_NAME as string;

export async function GET() {
  const favoriteProductsStr = cookies().get(name)?.value;
  let favoriteProducts: string[] = [];
  if (favoriteProductsStr) {
    favoriteProducts = JSON.parse(favoriteProductsStr) as string[];
  }

  return NextResponse.json({ ok: true, data: favoriteProducts });
}

export async function POST(request: NextRequest) {
  const requestHeader = new Headers(request.headers);
  const productStr = requestHeader.get("product");

  if (!productStr) return NextResponse.error();

  const product: CategoryProduct | ProductVariant = JSON.parse(productStr);

  const favoriteProductsStr = cookies().get(name)?.value;
  let favoriteProducts: (CategoryProduct | ProductVariant)[] = [];
  if (favoriteProductsStr) {
    favoriteProducts = JSON.parse(favoriteProductsStr) as (
      | CategoryProduct
      | ProductVariant
    )[];
  }
  if (favoriteProducts.map((item) => item.id).includes(product.id)) {
    favoriteProducts = favoriteProducts.filter(
      (_product) => _product.id !== product.id
    );
  } else {
    favoriteProducts.push(product);
  }
  const value = JSON.stringify(favoriteProducts);

  cookies().set({ name, value });
  return NextResponse.json({ ok: true, data: favoriteProducts });
}

export async function DELETE() {
  cookies().delete(name);
  return NextResponse.json({ ok: true });
}
