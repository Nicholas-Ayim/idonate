import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    //    baseUrl:"https://blood-bank-data.onrender.com/search",

    baseUrl: "http://localhost:5000/search"
  }),
  endpoints: (builder) => ({
    searchHospitalName: builder.query({
      query: ({ keyword }) => {
        let queryParams = new URLSearchParams();
        if (keyword) 
          {
            queryParams.append("keyword", keyword)
          }
        return {
          url: `/findDonors?${queryParams.toString()}`
        };
      }
    })
  })
});



export const { useSearchHospitalNameQuery } = searchApi;
export default searchApi;
