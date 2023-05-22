import React, { useState } from 'react'
import axios from "axios";
import { API_URL } from '../helper';
import { useToast } from '@chakra-ui/react';

function RequestPassword() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const onSendreq = async () => {
    try {
      let res = await axios.post(`${API_URL}/auth/customer/forgot-password`, {
        email: email,
      }
      );
      console.log("ini dari btn regis", res);
      if (res.data.success) {
        alert(res.data.message);
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("error", error);
      // alert(error.response.data.error[0].msg);
      toast({
        title: `${error.response.data.error[0].msg}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }
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