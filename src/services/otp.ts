"use server";
import { SuccessResponse } from "@/types/sucess";
import { api } from "./api";
import { ErrorResponse } from "@/types/error";

export const sendOtp = async (
  phoneNumber: string
): Promise<SuccessResponse> => {
  try {
    const res = await fetch(`${api}/otp/send`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
    const result: SuccessResponse | ErrorResponse = await res.json();

    if ("error" in result) {
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (
  phoneNumber: string,
  otp: string
): Promise<SuccessResponse> => {
  try {
    const res = await fetch(`${api}/otp/verify`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ phoneNumber, otp }),
    });
    const result: SuccessResponse | ErrorResponse = await res.json();

    if ("error" in result) {
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    throw error;
  }
};
