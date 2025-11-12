import { CartItem } from "@/types/interface";
import { createSlice } from "@reduxjs/toolkit";

interface CheckoutItem {
  items: CartItem[];
}

const initialState: CheckoutItem = {
  items: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutItems: (state, action) => {
      state.items = action.payload;
    },
    clearCheckoutItems: (state) => {
      state.items = [];
    },
  },
});

export const { setCheckoutItems, clearCheckoutItems } = checkoutSlice.actions;
export default checkoutSlice.reducer;
