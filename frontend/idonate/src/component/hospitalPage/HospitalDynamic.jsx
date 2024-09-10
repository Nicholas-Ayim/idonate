
import {NavLink,Outlet, useNavigate}  from "react-router-dom"
import {gsap} from "gsap"
import {ScrollTrigger} from "gsap/dist/ScrollTrigger"
import { useEffect, useState } from "react"

export default function HospitalDynamic() {
    gsap.registerPlugin(ScrollTrigger)

    const [outlet,setOutlet] = useState(false)
  
    const pages = ["Donor Register","Donor Verification","Donor History","Hospital Profile","Logout"]
    // const navigate = useNavigate()
  return (
<>
<div className="flex md:flex-row flex-col gap-[1rem] md:gap-0  md:h-[100vh]  w-[100%] md:items-center md:justify-center py-[1rem] md:p-[0rem]">
<div className="flex md:flex-col md:bg-[blue] w-[100%] h-[100%] flex-wrap items-center justify-center gap-[1rem] md:w-[calc(100%-80%)]">

    {pages.map(page=>(
  <div key={page} className="md:hover:md-custom-hover md:p-[.5rem]">
  <NavLink to={`/hospital/dashboard/${page}`} className={({isActive})=>{
   return isActive ? "page-selected text-[red] md:bg-[green] md:text-[#fff] border-[1px] border-[#fff] p-[.5rem] rounded-[10px]" : "md:text-[#fff]"
  }} onClick={()=>setOutlet(true)}>{page}</NavLink>
  </div>
    )
    )
    }
    
</div>
<div className="w-[100%] md:w-[calc(100%-20%)] h-[100%]">
 {
  outlet ? (
    <Outlet/>
  ):(
    <div className="h-[100%] bg-[#000] text-[#fff] ">no outlet</div>
  )
 }

</div>

</div>


</>
  )
}
