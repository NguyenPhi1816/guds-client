import { Cart } from "./cart";

export interface Checkout extends Cart {
  inventoryNumber: number;
}
