import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Await, NavLink, useParams } from 'react-router-dom'
import { API_URL } from '../helper'
import axios from 'axios'
import { HiEye, HiEyeOff } from 'react-icons/hi'

function ResetPassword() {
  const param = useParams()
  const [password, setPassword] = useState("")
  const [confirmationpassword, setConfirmationPassword] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState("password");

  const klik = () => {
    if (visible === "password") {
      setVisible("text")
    } else {
      setVisible("password")
    }
  }
  const Resetbtn = async () => { }
  return (
    <section className='form bg-bgglass rounded-[20px] shadow-sm shadow-yellow-50 box-border w-[320px] p-5 mt-24 mb-8 m-auto hover:scale-105 duration-500'>
      <div className='flex flex-col gap-3'>
        <h1 className='text-[#1BFD9C] font-bold text-3xl text-center'>Reset Password</h1>
        <h1 className='text-white font-bold text-lg '>Make your new Password</h1>

        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='font-semibold text-[#1BFD9C]'>Password</label>
          <div className='flex hover:scale-105 duration-300'>
            <input onChange={(e) => setPassword(e.target.value)} type={visible} placeholder='Password' className='rounded-xl rounded-tr-none rounded-br-none w-full px-2 bg-transparent border border-emerald-300  text-white outline-none ' />
            <button className='bg-transparent h-[26px] px-1 text-xl rounded-tr-xl rounded-br-xl border border-emerald-300 text-white' type='button' onClick={klik}> {visible ? <HiEye /> : <HiEyeOff />}</button>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='font-semibold text-[#1BFD9C]'>Confirmation Password</label>
          <div className='flex hover:scale-105 duration-300'>
            <input onChange={(e) => setConfirmationPassword(e.target.value)} type={visible} placeholder='Confirmation Password' className='rounded-xl rounded-tr-none rounded-br-none w-full px-2 bg-transparent border border-emerald-300  text-white outline-none ' />
            <button className='bg-transparent h-[26px] px-1 text-xl rounded-tr-xl text-white rounded-br-xl border border-emerald-300' type='button' onClick={klik}> {visible ? <HiEye /> : <HiEyeOff />}</button>
          </div>
          <p className='text-sm text-white'> Min <span className='text-[#1BFD9C]'>8 character</span>  have a <span className='text-[#1BFD9C]'>capitalize</span>  and a <span className='text-[#1BFD9C]'>number</span>  </p>
        </div>

        <button type='button' className='text-white bg-emerald-400 font-bold border border-[#1BFD9C] rounded-xl w-1/2 mx-auto mt-4 hover:bg-emerald-300 hover:border-white hover:text-black duration-500 hover:scale-110' onClick={Resetbtn}>Reset</button>

      </div>
    </section>
  )
}

export default ResetPassword