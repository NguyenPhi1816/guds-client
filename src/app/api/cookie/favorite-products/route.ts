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
  const productId = requestHeader.get("productId");

  if (!productId) return NextResponse.error();

  const favoriteProductsStr = cookies().get(name)?.value;
  let favoriteProducts: string[] = [];
  if (favoriteProductsStr) {
    favoriteProducts = JSON.parse(favoriteProductsStr) as string[];
  }
  if (favoriteProducts.includes(productId)) {
    favoriteProducts = favoriteProducts.filter(
      (_productId) => _productId !== productId
    );
  } else {
    favoriteProducts.push(productId);
  }
  const value = JSON.stringify(favoriteProducts);

  cookies().set({ name, value });
  return NextResponse.json({ ok: true, data: favoriteProducts });
}

export async function DELETE() {
  cookies().delete(name);
  return NextResponse.json({ ok: true });
}
