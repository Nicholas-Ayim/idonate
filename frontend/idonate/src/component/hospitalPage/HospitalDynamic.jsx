
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
<div className="flex md:flex-row flex-col  md:h-[100%]  w-[100%] md:justify-center ">
<div className="flex md:flex-col md:bg-[#fff] w-[100%] h-[100%] flex-wrap items-center md:h-[100vh] justify-center gap-[1rem] md:w-[calc(100%-80%)]">

    {pages.map(page=>(
  <div key={page} className="md:hover:md-custom-hover md:p-[.5rem]">
  <NavLink to={`/hospital/dashboard/${page}`} className={({isActive})=>{
   return isActive ? "page-selected text-[red] md:bg-[green] md:text-[#fff] border-[1px] border-[#fff] p-[.5rem] rounded-[10px]" : "md:text-[#181a1b]"
  }} onClick={()=>setOutlet(true)}>{page}</NavLink>
  </div>
    )
    )
    }
    
</div>

 {
  outlet ? (
    <Outlet/>
  ):(
    <div className="h-[100%] bg-[#000] w-[100%] text-[#fff] ">no outlet</div>
  )
 }


</div>


</>
  )
}
