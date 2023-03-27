import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion'
import { MdShoppingBasket } from "react-icons/md";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Iphone14 from '../img/IphoneA.png'
import NotFound from "../img/NotFound.svg";

function ScrollProduct({ data, }) {
  const [scrollValue, setScrollValue] = useState(0);
  const flag = true
  const [items, setItems] = useState([]);
  const scrollProduct = useRef();
  useEffect(() => {
    scrollProduct.current.scrollLeft += scrollValue;
  }, [scrollValue]);

  const scrollLeft = () => {
    document.getElementById("content").scrollLeft -= 200;
  }
  const scrollRight = () => {
    document.getElementById("content").scrollLeft += 200;
  }

  return (

    <section className="w-full my-6 rounded-3xl px-4">
      <div className="w-full flex items-center justify-between relative">
        <p className="text-2xl text-[#1BFD9C] py-4 font-semibold capitalize text-headingColor">
          Hot offering
        </p>
        <div className="absolute right-0 top-5 ">
          <button onClick={scrollLeft} className="p-2 m-2 rounded-full bg-emerald-400 hover:bg-emerald-300 hover:scale-110 duration-500 cursor-pointer">
            <FiChevronLeft className="text-white hover:text-black duration-500" />
          </button>
          <button onClick={scrollRight} className="p-2 m-2 rounded-full bg-emerald-400 hover:bg-emerald-300 hover:scale-110 duration-500 cursor-pointer">
            <FiChevronRight className="text-white hover:text-black duration-500" />
          </button>
        </div>
      </div>
      <div ref={scrollProduct} id="content" className='gap-3 flex items-center justify-start overflow-x-hidden scroll-smooth  scrollbar-hide'>
        <div
          key={1}
          className="w-[120px] h-[175px] min-w-[150px] md:w-6 0 md:min-w-[200px]  bg-bgglass backdrop-blur hover:scale-90 duration-500 rounded-lg py-2 px-4  my-12 hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
        >
          <div className="w-full flex items-center justify-between">
            <motion.div
              className="w-40 h-40 -mt-20 md:-mt-8 drop-shadow-2xl duration-500"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={Iphone14}
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              whileTap={{ scale: 1.2 }}
              className="w-10 h-8 px-2 md:w-8 md:h-8 rounded-full bg-emerald-400 flex items-center justify-center cursor-pointer hover:shadow-md hover:scale-110 duration-500 -mt-8"
            // onClick={() => setItems([...cartItems, item])}
            >
              <MdShoppingBasket className="text-white hover:text-black duration-500" />
            </motion.div>
          </div>

          <div className="w-full flex flex-col items-end justify-end -mt-8">
            <p className="text-[#1BFD9C] font-semibold text-base md:text-lg">
              tittle
            </p>
            <p className="mt-1 text-sm text-white">
              Item descp
            </p>
            <div className="flex items-center gap-8">
              <p className="text-lg text-white font-semibold">
                <span className="text-lg font-bold text-red-500">$</span> price
              </p>
            </div>
          </div>
        </div>





      </div>
    </section>
  )
}

export default ScrollProduct