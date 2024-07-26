// app/api/vnpay/create-payment-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs from "query-string";
import dateFormat from "dateformat";

export async function POST(request: NextRequest) {
  const ipAddr =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("host");

  const config = {
    vnp_TmnCode: process.env.TMN_CODE!,
    vnp_HashSecret: process.env.HASH_SECRET!,
    vnp_Url: process.env.VNP_URL!,
    vnp_ReturnUrl: process.env.RETURN_URL!,
  };

  const date = new Date();
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const createDate = dateFormat(date, "yyyymmddHHmmss");
  const expireDate = dateFormat(tomorrow, "yyyymmddHHmmss");
  const orderId = dateFormat(date, "HHmmss");

  const {
    amount,
    bankCode,
    orderDescription: orderInfo,
    orderType,
    language: locale = "vn",
  } = await request.json();

  const currCode = "VND";
  let vnp_Params: any = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.vnp_TmnCode,
    vnp_Amount: amount * 100,
    vnp_CreateDate: createDate,
    vnp_CurrCode: currCode,
    vnp_IpAddr: "127.0.0.1",
    vnp_Locale: locale,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_ReturnUrl: config.vnp_ReturnUrl,
    vnp_ExpireDate: expireDate,
    vnp_TxnRef: orderId,
  };

  //   vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
  const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const vnpUrl = `${config.vnp_Url}?${qs.stringify(vnp_Params, {
    encode: false,
  })}`;

  console.log(vnpUrl);

  //   return NextResponse.redirect(vnpUrl);
}

function sortObject(obj: any) {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
