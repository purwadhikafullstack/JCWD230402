import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",


    initialState: {
        name: "",
        email: "",
        statusId: "",
        profileImage:"https://ionicframework.com/docs/img/demos/avatar.svg",

    },

    reducers: {
        loginAction: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.gender = action.payload.gender;
            state.phone = action.payload.phone;
            state.address = action.payload.address;
            state.profileImage = action.payload.profileImage;
            state.statusId = action.payload.statusId;
            console.log('data from statusId reducer:', state.statusId);

        },
        logoutAction: (state, action) => {
            localStorage.removeItem('Gadgetwarehouse_userlogin');
            state.name = '';
            state.email = '';
            state.gender = '';
            state.phone = '';
            state.address = '';
            state.profileImage = "https://ionicframework.com/docs/img/demos/avatar.svg";
            state.statusId = null;
        }

    },
  },
});

// Export action function nya
export const { loginAction, logoutAction } = authSlice.actions; // fungsi di dalam property reducers

// Export reducersnya
export default authSlice.reducer;
