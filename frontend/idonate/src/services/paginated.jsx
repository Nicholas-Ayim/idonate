import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const paginatedApi = createApi({
  reducerPath: "paginated",
  baseQuery: fetchBaseQuery({
    //    baseUrl:"https://blood-bank-data.onrender.com/paginate",

    baseUrl: "http://localhost:5000/paginate"
  }),
  endpoints: (builder) => ({
    hospitalPaginated: builder.query({
      query: ({ page, limit }) =>
        `/paginated/donors?page=${page}&limit=${limit}`
    })
  })
});

export const { useHospitalPaginatedQuery } = paginatedApi;
export default paginatedApi;
