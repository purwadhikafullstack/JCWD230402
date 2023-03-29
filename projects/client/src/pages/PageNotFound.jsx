import React from 'react'
import './PageNotFound.scss'
import { NavLink } from 'react-router-dom'

function Pagenotfound() {
  return (
    <div className='body w-full h-screen'>
<div id="app">
      <div id="wrapper" className='flex flex-col gap-4 items-center'>
        <h1 class="glitch" data-text="404 not found">404 not found</h1>
        <button type='button'  className='bg-[#1BFD9C] w-1/4 text-white font-bold text-2xl rounded-2xl hover:text-black hover:scale-110 duration-500 '><NavLink to='/'>Back Home</NavLink></button>
      </div>
    </div>
    </div>
  )
}

export default Pagenotfound