import React, { useState } from 'react'
import { Await, NavLink, useParams } from 'react-router-dom'
import { API_URL } from '../helper'
import axios from 'axios'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'

function Verification() {
  const toast = useToast()
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

  const verify = async () => {
    try {
      if (password === confirmationpassword) {
        let res = await axios.patch(`${API_URL}/auth/customer/verify`, {
          password, confirmationpassword
        }, {
          headers: {
            'Authorization': `Bearer ${param.token}`
          }
        })
        console.log('ini res dari verify', res)
        navigate("/login");
      }
      else {
        // alert("password not match")
        toast({
          title: `password not match`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error)
      // alert(error.response.data.error[0].msg)
      if (error.response.data.error[0].msg == "Invalid value") {
        toast({
          title: `Your password is empty`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: `${error.response.data.error[0].msg}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <section className='form bg-bgglass rounded-[20px] shadow-sm shadow-yellow-50 box-border w-[320px] p-5 mt-24 mb-8 m-auto hover:scale-105 duration-500'>
      <div className='flex flex-col gap-3'>
        <h1 className='text-white font-bold text-3xl text-center'>Verification</h1>
        <h1 className='text-white font-bold text-lg '>Make your Password</h1>

        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='font-semibold text-emerald-300'>Password</label>
          <div className='flex hover:scale-105 duration-300'>
            <input onChange={(e) => setPassword(e.target.value)} type={visible} placeholder='Password' className='rounded-xl rounded-tr-none rounded-br-none w-full px-2 bg-transparent border border-emerald-300  text-white outline-none ' />
            <button className='bg-transparent h-[26px] px-1 text-xl rounded-tr-xl rounded-br-xl border border-emerald-300' type='button' onClick={klik}> {visible ? <HiEye /> : <HiEyeOff />}</button>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='font-semibold text-emerald-300'>Confirmation Password</label>
          <div className='flex hover:scale-105 duration-300'>
            <input onChange={(e) => setConfirmationPassword(e.target.value)} type={visible} placeholder='Confirmation Password' className='rounded-xl rounded-tr-none rounded-br-none w-full px-2 bg-transparent border border-emerald-300  text-white outline-none ' />
            <button className='bg-transparent h-[26px] px-1 text-xl rounded-tr-xl rounded-br-xl border border-emerald-300' type='button' onClick={klik}> {visible ? <HiEye /> : <HiEyeOff />}</button>
          </div>
          <p className='text-sm text-white'> Min <span className='text-orange-400'>8 character</span>  have a <span className='text-orange-400'>capitalize</span>  and a <span className='text-orange-400'>number</span>  </p>
        </div>

        <button type='button' className='text-[#1BFD9C] bg-transparent font-bold border border-[#1BFD9C] rounded-xl w-1/2 mx-auto mt-4 hover:bg-[#1BFD9C] hover:border-white hover:text-black duration-500 hover:scale-110' onClick={verify}>Sign Up</button>

      </div>
    </section>
  )
}

export default Verification