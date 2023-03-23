import React from 'react'
import { NavLink } from 'react-router-dom'

function ForgotPassword() {
  return (
    <section>
        <div className='flex flex-col md:w-[500px] m-auto p-8 gap-8 my-6 rounded-3xl bg-slate-100 shadow-xl shadow-gray-700;'>
            <h1 className='font-bold text-[1.2em] m-auto' >Reset Password</h1>
           <input type="email" placeholder='@Your Email' className='bg-gray-200 px-2 py-1' />
           <button className='bg-emerald-300 hover:bg-emerald-400 rounded-[10px] font-bold text-white w-1/3 px-4 duration-500'><NavLink to ='/Reset'>Send Request</NavLink></button>
        </div>
    </section>
  )
}

export default ForgotPassword