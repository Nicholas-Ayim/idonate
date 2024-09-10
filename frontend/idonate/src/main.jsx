import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import HospitalDashboard from './component/hospitalPage/HospitalDashboard.jsx'
import HospitalDynamic from './component/hospitalPage/HospitalDynamic.jsx'
import ErrorPage from './component/ErrorPage/ErrorPage.jsx'

import store from "./store/store.jsx";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persistor = persistStore(store);


const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    errorElement:<div>Not Found</div>
  },
  {
    path:"/hospital/dashboard",
    element:<HospitalDynamic/>,
    errorElement:<ErrorPage/>,
    children:[
      {
        // create dynaimic paths for routing
        path:"/hospital/dashboard/:page",
        element:<HospitalDashboard/>
      }
    ]
  }
  
])
createRoot(document.getElementById('root')).render(
  <StrictMode>

<Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {" "}
        {/* Use persistor directly */}
        <RouterProvider router={router} />

      </PersistGate>
    </Provider>

  </StrictMode>,
)
