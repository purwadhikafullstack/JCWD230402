
import React, { useState } from 'react'
import { FaShoppingBasket, FaUserCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo'
import "./Navbar.css"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutAction } from '../reducers/auth'
import { API_URL } from '../helper';
import {
  Stack,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";



function Navbar() {
  // const locations = useLocation();

  // const parameters = new URLSearchParams(locations.search);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };
  const email = useSelector((state) => state.authReducer.email);
  const name = useSelector((state) => state.authReducer.name);
  const statusId = useSelector((state) => state.authReducer.statusId);
  const profileImage = useSelector((state) => state.authReducer.profileImage);


  const logoutBtn = () => {
    localStorage.removeItem("Gadgetwarehouse_userlogin");
    dispatch(logoutAction());
    navigate("/", { replace: true });
  };


  // bikin function lngsung navigate ke all products page, set page to 1, set filter params to search usestate
  // function onSearchBtn() {

  //   if (locations.pathname == "/product/all-products") {
  //     alert("aaaaaaaaaaaa");
  //     parameters.set("page", 2);
  //     navigate({ search: parameters.toString() });
  //     navigate(`/product/all-products?filter=${search}&page=1`);
  //   } else {
  //     navigate("/product/all-products?page=3");
  //   }
  // }

  return (
    <header className="navbar fixed z-50 w-screen top-0 left-0 p-3 px-4 md:p-6 md:px-12 bg-bgglass backdrop-blur border-b-2 border-b-bgglass">
      {/*Desktop & Tablet*/}
      <div className="flex w-full h-full px-4 items-center justify-between">
        {/* ======================================================= SearchBar ========================================= */}
        <div className="flex">
          <NavLink to="/" className="flex items-center gap-10">
            <Logo />
            <p className="text-xl font-bold text-white">
              Gadget<span className="text-[#1BFD9C]">House</span>
            </p>
          </NavLink>
          {/* <div className="ml-5">
            <Stack spacing={4}>
              <InputGroup>
                <Input
                  type="search"
                  variant="filled"
                  placeholder="Enter username"
                  bgColor="whiteAlpha.300"
                  onChange={(e) => setSearch(e.target.value)}
                  color="white"
                />
                <InputRightAddon
                  pointerEvents="visible"
                  as="button"
                  onClick={() => {
                    onSearchBtn();
                  }}
                  border="none"
                  bgColor="#1BFD9C"
                  color="black"
                  _active={{ bg: "black", color: "white" }}
                >
                  <Icon as={FiSearch} />
                </InputRightAddon>
              </InputGroup>
            </Stack>
          </div> */}
        </div>

        <div className="flex items-center gap-x-4 md:gap-x-8">
          <motion.ul
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="hidden md:flex items-center md:gap-4 lg:gap-6"
          >
            <li className="text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer">
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer">
              <NavLink to="/product/all-products">Product</NavLink>
            </li>
            <li className="text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer">
              <NavLink>About Us</NavLink>
            </li>
            <li className="text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer">
              Service
            </li>
          </motion.ul>


                    {statusId ? <div className='flex gap-4'>
                        <div className='relative flex items-center justify-center mr-2 '>
                            <button type='button'><NavLink to='/CartPage'><FaShoppingBasket className='text-[#1BFD9C] hover:text-[#82ffc9] hover:text-xl duration-500 text-2xl  cursor-pointer' /></NavLink></button>
                            <div className=' absolute -top-3 -right-4  w-5 h-5 rounded-full bg-red-400 flex items-center justify-center animate-bounce'>
                                <p className=' text-xs text-white font-semibold'>2</p>
                            </div>
                        </div>
                        {/* <button className='flex gap-2 text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={toggleMenu}> <img src={profileImage ? `${API_URL}${profileImage}` : ''} className='text-2xl text-white cursor-pointer '/>{name}</button> */}
                        <div class="flex items-center gap-2 text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium cursor-pointer" onClick={toggleMenu}>
                        <img src={profileImage ? `${API_URL}${profileImage}` : ''} className="w-10 h-10 rounded-full" alt="" />
  <span>{name}</span>
</div>

                        <div className={`absolute flex flex-col px-2 items-center text-start bg-bgglass backdrop-blur w-[110px] md:w-[130px] h-[270px] md:h-[270px] gap-2 top-[55px] md:top-[78px] bottom-0 py-4 duration-500 rounded-3xl ${showMenu ? "right-2 md:right-10" : "right-[-250px]"}`} >
                            <ul className='flex flex-col gap-4'>
                                <li className='flex gap-2'>
                                    <div className='text-2xl text-white cursor-pointer ' onClick={hideMenu} ><img src={`${API_URL}${profileImage}`} /></div>
                                    <h1 className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium'>{name}</h1>
                                </li>
                                <li>
                                    <NavLink to='/customerProfile' className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Profile</NavLink>
                                </li>
                                <li>
                                    <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Cart</NavLink>
                                </li>
                                <li>
                                    <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Orders</NavLink>
                                </li>
                                <li>
                                    <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu} to='/request'>Reset Password</NavLink>
                                </li>
                            </ul>
                            <div className='flex flex-col gap-2'>
                                <span className='border-b-2 p-1 border-gray'></span>
                                <button type='button' onClick={logoutBtn} className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black hover:scale-105 duration-500'>Log Out</button>
                            </div>
                        </div>
                    </div> 
                    : 
                        <div className=' flex gap-2 md:gap-8'>
                        <button className='text-white text-xs md:text-base bg-emerald-400 px-2 md:px-5 py-1 rounded-3xl font-semibold hover:text-black hover:bg-emerald-300 hover:scale-110 duration-500'><NavLink to='/login'>Login</NavLink></button>
                        <button className='text-white text-xs md:text-base bg-emerald-400 px-2 md:px-3 py-1 rounded-3xl font-semibold hover:text-black hover:bg-emerald-300 hover:scale-110 duration-500'><NavLink to='/register'>Register</NavLink></button>
                    </div>}

                </div>
              </div>
              <button
                className="flex gap-2 text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium"
                onClick={toggleMenu}
              >
                {" "}
                <FaUserCircle className="text-2xl text-white cursor-pointer " />{" "}
                {name}{" "}
              </button>
              <div
                className={`absolute flex flex-col px-2 items-center text-start bg-bgglass backdrop-blur w-[110px] md:w-[130px] h-[270px] md:h-[270px] gap-2 top-[55px] md:top-[78px] bottom-0 py-4 duration-500 rounded-3xl ${
                  showMenu ? "right-2 md:right-10" : "right-[-250px]"
                }`}
              >
                <ul className="flex flex-col gap-4">
                  <li className="flex gap-2">
                    <FaUserCircle
                      className="text-2xl text-white cursor-pointer "
                      onClick={hideMenu}
                    />
                    <h1 className="text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium">
                      {name}
                    </h1>
                  </li>
                  <li>
                    <NavLink
                      className="text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium"
                      onClick={hideMenu}
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium"
                      onClick={hideMenu}
                    >
                      Cart
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium"
                      onClick={hideMenu}
                    >
                      Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium"
                      onClick={hideMenu}
                      to="/request"
                    >
                      Reset Password
                    </NavLink>
                  </li>
                </ul>
                <div className="flex flex-col gap-2">
                  <span className="border-b-2 p-1 border-gray"></span>
                  <button
                    type="button"
                    onClick={logoutBtn}
                    className="bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black hover:scale-105 duration-500"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className=" flex gap-2 md:gap-8">
              <button className="text-white text-xs md:text-base bg-emerald-400 px-2 md:px-5 py-1 rounded-3xl font-semibold hover:text-black hover:bg-emerald-300 hover:scale-110 duration-500">
                <NavLink to="/login">Login</NavLink>
              </button>
              <button className="text-white text-xs md:text-base bg-emerald-400 px-2 md:px-3 py-1 rounded-3xl font-semibold hover:text-black hover:bg-emerald-300 hover:scale-110 duration-500">
                <NavLink to="/register">Register</NavLink>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
