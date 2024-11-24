"use server";

import { Voucher } from "@/types/promotion";
import { api } from "./api";
import { ErrorResponse } from "@/types/error";

export const getAvailableVouchers = async (): Promise<Voucher[]> => {
  try {
    const response = await fetch(`${api}/voucher`);
    const data: Voucher[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
