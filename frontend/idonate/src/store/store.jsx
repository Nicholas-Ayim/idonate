import { configureStore } from "@reduxjs/toolkit";
// import DonorReducer from "./features/donorSlice";

import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

import donorApi from "../services/donorReigsterApi";

import HospitalApi from "../services/hospitalApi";


import paginatedApi from "../services/paginated";

import searchApi from "../services/searchApi";

const reducer = combineReducers({
//   donors: DonorReducer,
  [donorApi.reducerPath]: donorApi.reducer,
  [paginatedApi.reducerPath]: paginatedApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer, 
  [HospitalApi.reducerPath]: HospitalApi.reducer, 

});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [donorApi.reducerPath,HospitalApi.reducerPath,paginatedApi.reducerPath,searchApi.reducerPath,]
};

const persistedReducer = persistReducer(persistConfig, reducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(donorApi.middleware,HospitalApi.middleware,paginatedApi.middleware,searchApi.middleware)
});

export default store;
