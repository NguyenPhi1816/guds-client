"use server";
import { AddressResponse, District, Province, Ward } from "@/types/address";

const api = process.env.NEXT_PUBLIC_GHN_API;
const token = process.env.GHN_TOKEN_API;

export const getProvince = async (): Promise<AddressResponse<Province[]>> => {
  const response = await fetch(`${api}/province`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Token: token,
    } as HeadersInit,
  });
  return response.json();
};

export const getDistrict = async (
  province_id: number
): Promise<AddressResponse<District[]>> => {
  const response = await fetch(`${api}/district?province_id=${province_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Token: token,
    } as HeadersInit,
  });
  return response.json();
};

export const getWard = async (
  district_id: number
): Promise<AddressResponse<Ward[]>> => {
  const response = await fetch(`${api}/ward?district_id=${district_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Token: token,
    } as HeadersInit,
  });
  return response.json();
};
