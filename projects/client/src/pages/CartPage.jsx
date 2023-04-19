import React from 'react'
import {CardCart} from '../components'

function CartPage() {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>
      <div>
      <CardCart />
      </div>

      <div className=' bg-bgglass w-full md:w-1/3 rounded-xl mb-4 py-5'>
        <div className='px-4 flex flex-col gap-4'>
        <div className=''>
            <h1 className="text-[#1BFD9C] text-center font-semibold"> Details</h1>
        </div>
        <div className='text-[#1BFD9C] flex justify-between'>
            <h3>Total Items <span></span></h3>
            <h3>$(total price)</h3>
        </div>
        <div className='flex flex-col gap-2 '>
            <button className='text-white hover:text-black hover:scale-105 bg-emerald-400 hover:bg-emerald-300 rounded-lg p-1 duration-500'>Continue Shopping</button>
            <button className='text-white hover:text-black hover:scale-105 bg-emerald-400 hover:bg-emerald-300 rounded-lg p-1 duration-500'>Delete All Item</button>
            <button className='text-white hover:text-black hover:scale-105 bg-emerald-400 hover:bg-emerald-300 rounded-lg p-1 duration-500'>Proceed To Checkout</button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default CartPage