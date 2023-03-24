import React from "react";
import "./Product.css"
import {FcSmartphoneTablet} from 'react-icons/fc'


function Product() {


  return (
    <section className="w-full my-6" id="menu">
    <div className="w-full flex flex-col items-center justify-center">
      <p className="text-2xl font-semibold capitalize text-blue-400 relative before:absolute before:rounded-lg before:content before:w-16 before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-orange-400 to-orange-600 transition-all ease-in-out duration-100 mr-auto">
        Our Product
      </p>

      <div className="w-full flex items-center justify-start lg:justify-center gap-8 py-6">
        {categories &&
          categories.map((category) => (
            <motion.div
              whileTap={{ scale: 0.75 }}
              key={category.id}
              className={`group ${
                filter === category.urlParamName ? "bg-yellow-300" : "bg-red-300"
              } w-24 min-w-[94px] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center hover:bg-blue-200 `}
              onClick={() => setFilter(category.urlParamName)}
            >
              <div
                className={`w-10 h-10 rounded-full shadow-lg ${
                  filter === category.urlParamName
                    ? "bg-white"
                    : "bg-green-400"
                } group-hover:bg-white flex items-center justify-center`}
              >
                <FcSmartphoneTablet
                  className={`${
                    filter === category.urlParamName
                      ? "text-black"
                      : "text-white"
                  } group-hover:text-black text-lg`}
                />
              </div>
              <p
                className={`text-sm ${
                  filter === category.urlParamName
                    ? "text-white"
                    : "text-textColor"
                } group-hover:text-white`}
              >
                {category.name}
              </p>
            </motion.div>
          ))}
      </div>
    </div>

    <div class="container page-wrapper">
  <div class="page-inner">
    <div class="row">
      <div class="el-wrapper">
        <div class="box-up">
          <img class="img" src="http://code.slicecrowd.com/labs/4/images/t-shirt.png" alt="" />
          <div class="img-info">
            <div class="info-inner">
              <span class="p-name">I feel like Pablo</span>
              <span class="p-company">Yeezy</span>
            </div>
            <div class="a-size">Available sizes : <span class="size">S , M , L , XL</span></div>
          </div>
        </div>

        <div class="box-down">
          <div class="h-bg">
            <div class="h-bg-inner"></div>
          </div>

          <a class="cart" href="#">
            <span class="price">$120</span>
            <span class="add-to-cart">
              <span class="txt">Add in cart</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
  )
}

export default Product