import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    id: null,
    name: "",
    email: "",
    statusId: null,
    profileImage: "https://ionicframework.com/docs/img/demos/avatar.svg",
  },

  reducers: {
    loginAction: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.gender = action.payload.gender;
      state.phone = action.payload.phone;
      state.address = action.payload.address;
      state.profileImage = action.payload.profileImage;
      state.statusId = action.payload.statusId;
    },
    logoutAction: (state, action) => {
      localStorage.removeItem("Gadgetwarehouse_userlogin");
      state.id = null;
      state.name = "";
      state.email = "";
      state.gender = "";
      state.phone = "";
      state.address = "";
      state.profileImage =
        "https://ionicframework.com/docs/img/demos/avatar.svg";
      state.statusId = null;
    },
  },
});

// Export action function nya
export const { loginAction, logoutAction } = authSlice.actions; // fungsi di dalam property reducers

// Export reducersnya
export default authSlice.reducer;
