import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const donorApi = createApi({
  reducerPath: "donor",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://blood-bank-data.onrender.com"

    baseUrl: "http://localhost:5000/donor/register"
  }),
  endpoints: (builder) => ({
    registerDonor : builder.mutation({
      query: ({ payload }) => ({
        url: "/donorRegister",
        method: "POST",
        body: payload
      })
    }),
    getRegisterdDonors: builder.mutation({
      query: ({ payload }) => ({
        url: "/all/donors",
        method: "GET",
        body: payload
      })
    })
  })
});

 export const {useRegisterDonorMutation,useGetRegisterdDonorsMutation} = donorApi
 export  default donorApi;