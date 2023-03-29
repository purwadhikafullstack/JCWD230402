import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",

    initialState: {
        name: "",
        email: "",
        roleId:""
    },

    reducers: {
        adminloginAction: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.roleId = action.payload.roleId;
            console.log('data from roleId reducer:', state.roleId);
        },
    adminlogoutAction: (state, action) => {
        localStorage.removeItem('Gadgetwarehouse_adminlogin');
        state.name = '';
        state.email = '';
        state.roleId= null;
    }
},
});

// Export action function nya
export const { adminloginAction, adminlogoutAction } = adminSlice.actions; // fungsi di dalam property reducers

// Export reducersnya
export default adminSlice.reducer;