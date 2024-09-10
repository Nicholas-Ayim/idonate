import { useState } from "react"
import {FaHospital,FaFirstAid} from "react-icons/fa"
export default function DonorRegister() {
  const [hospitalName,setHospitalName] = useState("")
  const [donorName,setDonorName] = useState("")
  const [dob,setDob] = useState("")
  const [bloodType,setBloodType] = useState("")
  const [picture,setPicture] = useState("")
  const [picUploaded,setPicUploaded] = useState(false)
  // const [] = useState("")

  const data = [
    {
  name:"New Patients",
  number:178,
  icon:<FaHospital/>,
    },
    {
      name:"Blood Donations",
      number:178,
      icon:<FaFirstAid/>,
    },
    {
      name:"Register Donors",
      number:178,
      icon:<FaHospital/>,
    },
    {
      name:"New Patients",
      number:178,
      icon:<FaHospital/>,
    },
  ]
  const HandleSaveRecord = (e)=>{
    e.preventDefault()
    try{

    }catch(error){
      console.log(error)
    }

  }
  return (
<>
<div className="flex flex-col  flex-wrap gap-[1rem]">
<div className="flex justify-center flex-wrap gap-[1rem]">

{data.map((section,index)=>(
  <div key={section}>
  <div className="flex justify-between border-[1px] border-[#3d3434] h-[100px]  md:h-[100px] w-fit md:w-[200px] rounded-[10px] bg-[#fff] gap-[1rem] p-[1rem]">
    <div className="flex flex-col items-start justify-center">
      <h4 className="text-[20px] font-mono text-let">{section.number}</h4>
      <h4 className="text-[20px] font-mono text-left">{section.name}</h4>
      </div>
      <div className={`${index === 1 ? "bg-[red]" :"bg-[blue]" } rounded-[10px] text-[20px] w-[100%] flex items-center justify-center md:text-[32px] text-[#fff] text-center`}>
        {section.icon}
        </div>
  </div>

</div>
))}
</div>


<div className="flex flex-col w-[100%] bg-[#eee] rounded-[10px]">

<div className="flex justify-between w-[100%] bg-[red]  px-[2rem] items-center ">
<p className="text-[#fff] md:text-[28px]">Donor Registration</p>
<img src="/docImg.jpg" className="object-cover h-[50px] w-[50px] rounded-[10px]"/>
</div>

{/* forms section below */}
<div className="flex flex-col w-[100%]">

  <div className="flex flex-col pb-[.5rem]">
  <h4 className="pt-[.2rem] px-[2rem] text-[18px] font-mono">Hospital Section</h4>
  <hr className="border-[1px] border-[red] w-[100%]"/>
  </div>

  <div className="flex  flex-col px-[2rem] w-[100%]">

    <label className="flex gap-[.5rem] flex-col ">
      <h4>Hospital Name</h4>
    <input onChange={(e)=>setHospitalName(e.target.value)} type="text" placeholder="enter you name" className="border-[1px] rounded-[10px] border-[#000] p-[.3rem] w-[80%]"/>
    </label>

    
  </div>
  {/* ends hospital */}

  <div className="flex flex-col pt-[1rem]">
  <h4 className="px-[2rem] text-[18px] font-mono">Donor Section</h4>
  <hr className="border-[1px] border-[red] w-[100%]"/>
  </div>

  <div className="flex flex-col gap-[.5rem] w-[100%] px-[2rem] py-[.5rem]">

<div className="flex-col">
  <h4>Donor Name</h4>
<input type="text"  onChange={(e)=>setDonorName(e.target.value)} placeholder="enter you name" className="border-[1px]  rounded-[5px] p-[.3rem] border-[#000] w-[calc(100%-20%)] "/>
</div>

<div className="flex-col">
  <h4>Date Of Birth</h4>
<input  onChange={(e)=>setDob(e.target.value)} type="date" placeholder="enter you name" className="border-[1px]  rounded-[5px] p-[.3rem]  border-[#000] w-[calc(100%-20%)]"/>
</div>

<div className="flex-col">
  <h4>Blood Type</h4>
  <select  onChange={(e)=>setBloodType(e.target.value)} className="w-[100px] border-[1px] rounded-[5px] border-[#000] p-[.3rem]">
    <option className="text-[20px]">-</option>
    <option>AB-</option>
    <option>AB+</option>
    <option>A-</option>
    <option>O-</option>
    <option>O+</option>
  </select>
{/* <input type="text" placeholder="enter you name" className="border-[1px]  rounded-[5px] py-[.3rem]  p-[.5rem] border-[#000] w-[calc(100%-20%)]"/> */}
</div>

<div className="flex-col">
<h4>Upload Picture</h4>

  <div className="flex gap-[2rem] items-center ">
  <button className="border-[1px] md:hover:bg-[green] border-[red] rounded-[5px] px-[.3rem] " onChange={(e)=>setPicture(e.target.value)}>Take Photo</button>
  <p>OR</p>
  <input type="file" placeholder="enter you name" className="border-[1px] p-[.3rem] rounded-[5px] "/>
  </div>

</div>


<div className="flex justify-center items-center w-[100%]">
 
  <button className="border-[1px] border-[green] px-[.5rem] " onClick={(e)=>HandleSaveRecord(e)}>Save Record</button>
</div>




</div>
{/* ends hospital */}
</div>


</div>

</div>




</>
  )
}
