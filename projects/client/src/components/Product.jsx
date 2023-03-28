import React, { useState } from "react";
import { FcSmartphoneTablet } from 'react-icons/fc'
import { BsFillCartPlusFill } from 'react-icons/bs'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { categories } from "../utils/data";
import { useMotionValue, useTransform, motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import phoneA from '../img/Iphone14.png'
import { useSelector } from 'react-redux'



function Product() {
  const [filter, setFilter] = useState();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const statusId = useSelector((state) => state.authReducer.statusId);
  const navigate = useNavigate();


  const addcart = () => {
    if (statusId != 2) {
      navigate('/login')
    } else { navigate('/register') }
  }


  return (
    <section className="w-full my-6" id="menu">
      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold capitalize text-[#1BFD9C] relative transition-all ease-in-out duration-100 mr-auto">
          Our Product
        </p>

        <div className="w-full flex items-center justify-start lg:justify-center gap-8 py-6">
          {categories &&
            categories.map((category) => (
              <motion.div
                whileTap={{ scale: 0.75 }}
                key={category.id}
                className={`group ${filter === category.urlParamName ? "bg-yellow-300" : "bg-bgglass"
                  } w-24 min-w-[94px] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center hover:scale-105 duration-500 `}
                onClick={() => setFilter(category.urlParamName)}
              >
                <div
                  className={`w-10 h-10 rounded-full shadow-lg ${filter === category.urlParamName
                    ? "bg-white"
                    : "bg-green-400"
                    } group-hover:bg-white flex items-center justify-center`}
                >
                  <FcSmartphoneTablet
                    className={`${filter === category.urlParamName
                      ? "text-emerald-400"
                      : "text-white"
                      } group-hover:text-emerald-400 text-lg`}
                  />
                </div>
                <p
                  className={`text-sm ${filter === category.urlParamName
                    ? "text-white"
                    : "text-emerald-400"
                    } group-hover:text-white`}
                >
                  {category.name}
                </p>
              </motion.div>
            ))}
        </div>
      </div>


      <div className="flex flex-wrap">
        <div style={{ perspective: 2000 }}>
          {/* card */}
          <motion.div
            style={{ x, y, rotateX, rotateY, z: 100 }}
            drag
            dragElastic={0.15}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            whileTap={{ cursor: 'grabbing' }}
            className='w-[250px] mx-8 my-8 bg-bgglass rounded-[30px] shadow-sm shadow-white border-white px-3 py-4 cursor-grab hover:scale-105 relative'
          >

            {/* card image */}
            <motion.div
              style={{ x, y, rotateX, rotateY, z: 100000 }}
              className='absolute top-[-60px] -right-28 w-[350px]'
            >
              <img src={phoneA} className='' alt='' draggable='false' />
            </motion.div>
            {/* card title */}
            <h1 className='text-2xl mb-6 font-extrabold text-[#1BFD9C]'>Iphone14</h1>
            {/* card subtitle */}
            <p className='max-w-[300px] text-white mb-6'>
              Description
            </p>
            {/* btn & price wrapper */}
            <div className='flex items-center justify-between'>
              {/* card Info */}
              <button type="button" className="text-[#1BFD9C] text-3xl hover:scale-105 duration-300 cursor-pointer"><HiOutlineExclamationCircle /></button>
              <button onClick={addcart} type='button' className='bg-[#1BFD9C] hover:bg-[#67f7b9] hover:scale-105 hover:text-black duration-500 text-white text-sm font-medium py-2 px-2 rounded-2xl'>
                <BsFillCartPlusFill />
              </button>
              <div className='text-[24px] font-bold text-white'> <span className="text-red-500">$</span> 495.00</div>
            </div>
          </motion.div>
        </div>





      </div>
    </section>
  )
}

export default Product