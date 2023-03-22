import React, { useState } from 'react'
import { FaShoppingBasket, FaUserCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'

function Navbar() {
    const login = () => { }
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    const hideMenu = () => {
        setShowMenu(false)
    }

    const roleId = null

    return (
        <header className='sticky z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg- bg-[rgba(233,228,228,0.4)] backdrop-blur-md' >
            {/*Desktop & Tablet*/}
            <div className='flex w-full h-full px-4 items-center justify-between'>
                <NavLink to='/' className='flex items-center gap-2'>
                    <h2>Logo</h2>
                    <p className='text-xl font-bold text-white'>e<span className='text-emerald-500'>Gadget</span></p>
                </NavLink>
                {
                    <div className='flex items-center gap-8'>
                        <motion.ul
                            initial={{ opacity: 0, x: 200 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 200 }}
                            className='hidden md:flex items-center gap-8'>
                            <li className='text-xl text-gray-700 hover:text-blue-600 duration-100 transition-all ease-in-out cursor-pointer'><NavLink to='/'>Home</NavLink></li>
                            <li className='text-xl text-gray-700 hover:text-blue-600 duration-100 transition-all ease-in-out cursor-pointer'>Product</li>
                            <li className='text-xl text-gray-700 hover:text-blue-600 duration-100 transition-all ease-in-out cursor-pointer'>About Us</li>
                            <li className='text-xl text-gray-700 hover:text-blue-600 duration-100 transition-all ease-in-out cursor-pointer'>Service</li>
                        </motion.ul>
                        <div className='relative flex items-center justify-center '>
                            <FaShoppingBasket className='text-gray-600 text-2xl  cursor-pointer' />
                            <div className=' absolute -top-2 -right-4  w-5 h-5 rounded-full bg-red-400 flex items-center justify-center'>
                                <p className=' text-xs text-white font-semibold'>2</p>
                            </div>
                        </div>
                        <div className='relative'>
                            <button> <FaUserCircle className='text-2xl text-gray-600 cursor-pointer ' onClick={toggleMenu} />
                                {roleId == 1 ?
                                    <div className={`absolute flex flex-col px-2 items-center text-start bg-[rgba(256,256,256,0.4)] backdrop-blur-md w-[130px] md:w-[150px] h-[350px] md:h-[370px] gap-2 top-8 bottom-0 py-8 duration-500 rounded-3xl ${showMenu ? "-right-6 md-right-12" : "right-[-250px]"}`} >
                                        <ul className='flex flex-col gap-4'>
                                            <li>
                                                <FaUserCircle className='text-2xl text-gray-600 cursor-pointer ' onClick={hideMenu} />
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>User Management</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Product</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Category</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Warehouse</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Order</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Reports</NavLink>
                                            </li>
                                        </ul>
                                        <div className='flex flex-col gap-2 w-full'>
                                            <span className='border-b-2 p-auto border-gray'></span>
                                            <button className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black'>Log Out</button>
                                        </div>
                                    </div> :

                                    roleId == 2 ? <div className={`absolute flex flex-col px-2 items-center text-start bg-[rgba(256,256,256,0.4)] backdrop-blur-md w-[110px] md:w-[130px] h-[220px] md:h-[250px] gap-2 top-8 bottom-0 py-4 duration-500 rounded-3xl ${showMenu ? "-right-6" : "right-[-200px]"}`} >
                                        <ul className='flex flex-col gap-4'>
                                            <li>
                                                <FaUserCircle className='text-2xl text-gray-600 cursor-pointer ' onClick={hideMenu} />
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Profile</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Product</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Category</NavLink>
                                            </li>
                                        </ul>
                                        <div className='flex flex-col gap-2'>
                                            <span className='border-b-2 p-1 border-gray'></span>
                                            <button className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black'>Log Out</button>
                                        </div>
                                    </div> :

                                        roleId == 3 ? <div className={`absolute flex flex-col px-2 items-center text-start bg-[rgba(256,256,256,0.4)] backdrop-blur-md w-[110px] md:w-[130px] h-[220px] md:h-[230px] gap-2 top-8 bottom-0 py-4 duration-500 rounded-3xl ${showMenu ? "-right-6" : "right-[-200px]"}`} >
                                            <ul className='flex flex-col gap-4'>
                                                <li>
                                                    <FaUserCircle className='text-2xl text-gray-600 cursor-pointer ' onClick={hideMenu} />
                                                </li>
                                                <li>
                                                    <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Profile</NavLink>
                                                </li>
                                                <li>
                                                    <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Cart</NavLink>
                                                </li>
                                                <li>
                                                    <NavLink className='text-xs md:text-base text-black font-medium' onClick={hideMenu}>Orders</NavLink>
                                                </li>
                                            </ul>
                                            <div className='flex flex-col gap-2'>
                                                <span className='border-b-2 p-1 border-gray'></span>
                                                <button className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black'>Log Out</button>
                                            </div>
                                        </div> : <div className={`absolute flex flex-col px-2 items-center text-start bg-[rgba(256,256,256,0.4)] backdrop-blur-md w-[120px] h-[80px] gap-2 top-8 bottom-0 py-4 duration-500 rounded-3xl ${showMenu ? "-right-6" : "right-[-200px]"}`} >
                                            <div className='flex flex-col gap-2'>
                                                <button className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black'><NavLink to='/Login'>Login</NavLink></button>
                                                <button className='bg-emerald-300 hover:bg-emerald-400 px-1 rounded-lg font-bold text-white hover:text-black'><NavLink to='/Login'>Register</NavLink></button>
                                            </div>
                                        </div>
                                }
                            </button>

                        </div>
                    </div>
                }

            </div>

        </header>
    )
}

export default Navbar