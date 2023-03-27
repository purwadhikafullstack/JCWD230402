import React, { useState } from 'react'
import { FaShoppingBasket, FaUserCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo'
import "./Navbar.css"
import { useSelector } from 'react-redux'


function Navbar(props) {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    const hideMenu = () => {
        setShowMenu(false)
    }
    const email = useSelector((state) => state.authReducer.email);
    const statusId = useSelector((state) => state.authReducer.statusId);

    return (
        <header className='navbar fixed z-50 w-screen top-0 left-0 p-3 px-4 md:p-6 md:px-12 bg-bgglass backdrop-blur border-b-2 border-b-bgglass' >
            {/*Desktop & Tablet*/}
            <div className='flex w-full h-full px-4 items-center justify-between'>
                <NavLink to='/' className='flex items-center gap-10'>
                    <Logo />
                    <p className='text-xl font-bold text-white'>Gadget<span className='text-[#1BFD9C]'>House</span></p>
                </NavLink>

                <div className='flex items-center gap-x-4 md:gap-x-8'>
                    <motion.ul
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        className='hidden md:flex items-center md:gap-4 lg:gap-6'>
                        <li className='text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer'><NavLink to='/'>Home</NavLink></li>
                        <li className='text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer'>Product</li>
                        <li className='text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer'><NavLink>About Us</NavLink></li>
                        <li className='text-xl text-[#1BFD9C] hover:text-[#82ffc9] hover:text-lg duration-500 transition-all ease-in-out cursor-pointer'>Service</li>
                    </motion.ul>


                    {statusId == 2 ? <div className='flex gap-4'>
                        <div className='relative flex items-center justify-center '>
                            <FaShoppingBasket className='text-[#1BFD9C] hover:text-[#82ffc9] hover:text-xl duration-500 text-2xl  cursor-pointer' />
                            <div className=' absolute -top-3 -right-4  w-5 h-5 rounded-full bg-red-400 flex items-center justify-center animate-bounce'>
                                <p className=' text-xs text-white font-semibold'>2</p>
                            </div>
                        </div>
                        <button> <FaUserCircle className='text-2xl text-white cursor-pointer ' onClick={toggleMenu} /></button>
                        <div className={`absolute flex flex-col px-2 items-center text-start bg-bgglass backdrop-blur w-[110px] md:w-[130px] h-[270px] md:h-[270px] gap-2 top-[55px] md:top-[78px] bottom-0 py-4 duration-500 rounded-3xl ${showMenu ? "right-2 md:right-10" : "right-[-250px]"}`} >
                            <ul className='flex flex-col gap-4'>
                                <li className='flex gap-2'>
                                    <FaUserCircle className='text-2xl text-white cursor-pointer ' onClick={hideMenu} />
                                    <h1>nama</h1>
                                </li>
                                <li>
                                    <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Profile</NavLink>
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
                                <button type='button' className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black hover:scale-105 duration-500'>Log Out</button>
                            </div>
                        </div>

                    </div> 
                //     :
                //     roleId === 3 ?
                //     <div className='flex gap-4'>
                    
                //         <button> <FaUserCircle className='text-2xl text-white cursor-pointer ' onClick={toggleMenu} /></button>
                //         <div className={`absolute flex flex-col px-2 items-center text-start bg-bgglass backdrop-blur w-[110px] md:w-[130px] h-[220px] md:h-[250px] gap-2 top-[55px] md:top-[78px] bottom-0 py-4 duration-500 rounded-3xl ${showMenu ? "right-2 md:right-10" : "right-[-250px]"}`} >
                //             <ul className='flex flex-col gap-4'>
                //                 <li>
                //                     <FaUserCircle className='text-2xl text-white cursor-pointer ' onClick={hideMenu} />
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Profile</NavLink>
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Product</NavLink>
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Category</NavLink>
                //                 </li>
                //             </ul>
                //             <div className='flex flex-col gap-2'>
                //                 <span className='border-b-2 p-1 border-gray'></span>
                //                 <button type='button' className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black hover:scale-105 duration-500'>Log Out</button>
                //             </div>
                //         </div> 

                //     </div> 
                //     :
                //     roleId === 4 ?

                //     <div className='flex gap-4'>
                    
                //     <button> <FaUserCircle className='text-2xl text-white cursor-pointer ' onClick={toggleMenu} /></button>
                //     <div className={`absolute flex flex-col px-2 items-center text-start bg-bgglass backdrop-blur w-[130px] md:w-[150px] h-[350px] md:h-[370px] gap-2 top-[55px] md:top-[78px] bottom-0 py-4 duration-500 rounded-3xl ${showMenu ? "right-2 md:right-10" : "right-[-250px]"}`} >
                //     <ul className='flex flex-col gap-4'>
                //                 <li>
                //                     <FaUserCircle className='text-2xl text-white cursor-pointer ' onClick={hideMenu} />
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>User Management</NavLink>
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Product</NavLink>
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Category</NavLink>
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Warehouse</NavLink>
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Order</NavLink>
                //                 </li>
                //                 <li>
                //                     <NavLink className='text-xs md:text-base text-[#1BFD9C] hover:text-[#82ffc9] hover:text-sm duration-500 font-medium' onClick={hideMenu}>Reports</NavLink>
                //                 </li>
                //             </ul>
                //         <div className='flex flex-col gap-2'>
                //             <span className='border-b-2 p-1 border-gray'></span>
                //             <button type='button' className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black hover:scale-105 duration-500'>Log Out</button>
                //         </div>
                //     </div> 

                // </div>
                        : 
                        <div className=' flex gap-2 md:gap-8'>
                        <button className='text-white text-xs md:text-base bg-emerald-400 px-2 md:px-5 py-1 rounded-3xl font-semibold hover:text-black hover:bg-emerald-300 hover:scale-110 duration-500'><NavLink to='/login'>Login</NavLink></button>
                        <button className='text-white text-xs md:text-base bg-emerald-400 px-2 md:px-3 py-1 rounded-3xl font-semibold hover:text-black hover:bg-emerald-300 hover:scale-110 duration-500'><NavLink to='/register'>Register</NavLink></button>
                    </div>}



                </div>


            </div>

        </header>
    )
}

export default Navbar