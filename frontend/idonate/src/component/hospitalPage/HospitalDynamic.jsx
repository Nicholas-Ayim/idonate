import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useState } from "react";
import { selectHospitalLogin } from "../../feature/hospitalSlice";
import { useSelector } from "react-redux";
export default function HospitalDynamic() {
  gsap.registerPlugin(ScrollTrigger);

  const {HospitalName} = useSelector(selectHospitalLogin)
  const [outlet, setOutlet] = useState(false);

  const pages = [
    "Donor Register",
    "Donor Verification",
    "Donor History",
    "Hospital Profile",
    "Logout",
  ];

  return (
    <>
      <div className="flex md:flex-row flex-col md:h-[100%] w-[100%] md:justify-center">
        <div className="flex md:flex-col md:bg-[#fff] w-[100%] h-[100%] flex-wrap items-center md:h-[100vh] justify-center gap-[1rem] md:w-[calc(100%-80%)]">
          {pages.map((page) => (
            <div key={page} className="md:hover:md-custom-hover md:p-[.5rem]">
              <NavLink
                to={`/hospital/dashboard/${page}`}
                className={({ isActive }) =>
                  isActive
                    ? "page-selected text-[red] md:bg-[green] md:text-[#fff] border-[1px] border-[#fff] p-[.5rem] rounded-[10px]"
                    : "md:text-[#181a1b]"
                }
                onClick={() => setOutlet(true)}
              >
                {page}
              </NavLink>
            </div>
          ))}
        </div>

        {outlet ? (
          <Outlet />
        ) : (
          <div className="h-[100%] w-[100%] flex flex-col items-center justify-center bg-[#f4f4f4] text-[#333] p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome {HospitalName}!</h1>
            <p className="text-lg mb-6">
              Please select an option from the menu to get started.
            </p>
            <p className="text-sm text-gray-500">
              If you have any questions, feel free to reach out to support.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setOutlet(false)}
                className="bg-[#007bff] text-white px-4 py-2 rounded-lg hover:bg-[#0056b3] transition"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
