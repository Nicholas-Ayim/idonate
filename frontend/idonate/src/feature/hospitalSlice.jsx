import { createSlice } from "@reduxjs/toolkit";
import hospitalApi from "../services/hospitalApi";

const HospitalSlice = createSlice({
  name: "hospitalLogin",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
  
    builder.addMatcher(
      hospitalApi.endpoints.HospitalLogin.matchFulfilled,
      (state, { payload }) => {
        return { ...state, LoginData: payload };
      }
    );
  }
});

export const selectAll = (state) => state.hospitalLogin;

export const selectHospitalLogin = (state) => state.hospitalLogin.LoginData



export default HospitalSlice.reducer;
