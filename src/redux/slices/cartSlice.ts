import { createSlice } from "@reduxjs/toolkit";

interface CartState {
  count: number;
}

const initialState: CartState = {
  count: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    incrementCartCount: (state) => {
      state.count += 1;
    },
    decrementCartCount: (state) => {
      if (state.count > 0) state.count -= 1;
    },
    resetCartCount: (state) => {
      state.count = 0;
    },
  },
});

export const {
  setCartCount,
  incrementCartCount,
  decrementCartCount,
  resetCartCount,
} = cartSlice.actions;

export default cartSlice.reducer;
