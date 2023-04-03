import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom';

function CustomerProfile() {

  const statusId = useSelector((state) => state.authReducer.statusId);
  const name = useSelector((state) => state.authReducer.name);
  const gender = useSelector((state) => state.authReducer.gender);
  const phone = useSelector((state) => state.authReducer.phone);
  const address = useSelector((state) => state.authReducer.address);
  const profileImage = useSelector((state) => state.authReducer.profileImage);


  return (
    <div className='mt-32 mb-8 bg-bgglass w-full p-2 flex rounded-2xl backdrop-blur-md'>
      <div className='w-1/2 bg-orange-300 h-[500px] rounded-2xl'>
        <img src="" alt="" className='bg-orange-300' />
      </div>
      <div className='info flex flex-col text-center m-auto items-center justify-center text-[#1BFD9C] gap-20'>
        <div className='flex flex-col gap-10'>
          <h1 className='text-4xl font-semibold uppercase'>{name}</h1>
          <h3 className='text-2xl font-semibold uppercase'>{gender}</h3>
          <h3 className='text-2xl font-semibold uppercase'>{phone}</h3>
          <h3 className='text-2xl font-semibold uppercase'>{address}</h3>
        </div>
        <button type='button' className='btnedit bg-emerald-400 w-full font-bold cursor-pointer text-white hover:text-black hover:bg-emerald-300 hover:scale-105 duration-500 rounded-xl py-2'><NavLink to='/editprofile'>Edit</NavLink></button>

      </div>
    </div>
  )
}

export default CustomerProfile