import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion'
import { MdChevronLeft, MdChevronRight, MdShoppingBasket } from "react-icons/md";
import NotFound from "../img/NotFound.svg";

function ScrollProduct({ data,}) {
 const [scrollValue, setScrollValue] = useState(0);
 const flag = true
    const [items, setItems] = useState([]);
    const scrollProduct = useRef();
    useEffect(() => {
      scrollProduct.current.scrollLeft += scrollValue;
    }, [scrollValue]);
   
    return (

        <section className="w-full my-6 bg-[#FFE7CC] rounded-3xl px-4">
            <div className="w-full flex items-center justify-between">
                <p className="text-2xl py-4 font-semibold capitalize text-headingColor relative before:absolute before:rounded-lg before:content before:w-32 before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-emerald-400 to-emerald-600 transition-all ease-in-out duration-100">
                    Hot offering
                </p>
                <div className="hidden md:flex gap-3 items-center">
          </div>
            </div>
            <div   ref={scrollProduct} className={`w-full flex items-center gap-3 my-4 scroll-smooth  ${
        flag
          ? "overflow-x-scroll scrollbar-none"
          : "overflow-x-hidden flex-wrap justify-center"
      }`}>
          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Item descp
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>

          <div
            key={1}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-[rgba(256,256,256,0.4)] rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src="https://cdn.eraspace.com/media/catalog/product/i/p/iphone_14_pro_max_deep_purple_1_1.jpg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                // onClick={() => setItems([...cartItems, item])}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                tittle
              </p>
              <p className="mt-1 text-sm text-gray-500">
               Calories
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span> price
                </p>
              </div>
            </div>
          </div>


      </div>
        </section>
    )
}

export default ScrollProduct