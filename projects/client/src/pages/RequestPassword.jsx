import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { BsFacebook } from 'react-icons/bs'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function RequestPassword() {
  const [email, setEmail] = useState("");
  const onSendreq = async () => { }
  return (
    <section className='form bg-bgglass rounded-[20px] shadow-sm shadow-yellow-50 box-border w-[320px] p-5 mt-24 mb-8 m-auto hover:scale-110 duration-500'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-[#1BFD9C] font-bold text-xl text-center'>Request a New Password</h1>
        <h1 className='text-white font-bold text-sm '>Input your email to reset the password</h1>

        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='font-semibold text-emerald-300'>Email</label>
          <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Your Email' className='rounded-xl px-2 bg-transparent border border-emerald-300 text-white outline-none hover:scale-105 duration-300' />
          <p className='text-white text-xs'>You will receive an email confirmation after send request</p>
        </div>

        <button type='button' className='text-white bg-emerald-400 font-bold border border-[#1BFD9C] rounded-xl w-1/2 mx-auto mt-4 hover:bg-emerald-300 hover:border-white hover:text-black duration-500 hover:scale-110' onClick={onSendreq}>Send Request</button>
        
      </div>
    </section>
  )
}

export default RequestPassword