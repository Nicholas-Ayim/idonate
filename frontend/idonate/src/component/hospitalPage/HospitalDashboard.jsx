import React from 'react'
import { useParams } from 'react-router-dom'
import HospitalPage1 from '../DonorRegsiter/DonorRegister'
import DonorRegister from '../DonorRegsiter/DonorRegister'
import DonorVerification from '../DonorVerification/DonorVerification'
import DonorHistory from '../DonorHistory/DonorHistory'
import HospitalProfile from '../HospitalProfile/HospitalProfile'

export default function HospitalDashboard() {
    const params = useParams()
    console.log(params.page)
  return (
  <>
  <div className='h-[100%] w-[100%] bg-[#000] flex justify-center items-center
  '>
    {/* hospital page {params.page} */}
    {params.page == "Donor Register" ? <DonorRegister/>:  params.page == "Donor Verification" ? <DonorVerification/>  : params.page == "Donor History" ? <DonorHistory/> : params.page == "Hospital Profile" ? <HospitalProfile/> : "Logout"
    }
  </div>
  </>
  )
}
