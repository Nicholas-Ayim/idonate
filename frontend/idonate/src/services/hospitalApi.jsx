import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const HospitalApi = createApi({
  reducerPath: "HospitalApi",
  baseQuery: fetchBaseQuery({
    // baseUrl:"https://blood-bank-data.onrender.com/hospital",
    baseUrl: "http://localhost:5000/hospital"
  }),
  endpoints: (builder) => ({
    HospitalSignup: builder.mutation({
      query: (payload) => ({
        url: "/hospitalSignup",
        method: "POST",
        body: payload
      })
    }),
    HospitalLogin: builder.mutation({
      query: (payload) => ({
        url: "/hospitalLogin",
        method: "POST",
        body: payload
      })
    })
  })
});

export const{useHospitalSignupMutation,useHospitalLoginMutation}= HospitalApi;

export default HospitalApi;
