import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    length: 0,
  },

  reducers: {
    cartAction: (state, action) => {
      state.length = action.payload;
    },
    cartEmpty: (state, action) => {
      state.length = 0;
    },
  },
});

// Export action function nya
export const { cartAction, cartEmpty } = cartSlice.actions; // fungsi di dalam property reducers

// Export reducersnya
export default cartSlice.reducer;
