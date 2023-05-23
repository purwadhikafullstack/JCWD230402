import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { BsFacebook } from 'react-icons/bs'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginAction } from "../reducers/auth";
import { API_URL } from '../helper';
import { NavLink } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

function Login() {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visible, setVisible] = useState("password");

    const klik = () => {
        if (visible === "password") {
            setVisible("text")
        } else {
            setVisible("password")
        }
    }

    const onBtnLogin = async () => {
        try {
            if (email === "" || password === "") {
                // alert("Please enter your credentials");
                toast({
                    title: `Please enter your credentials`,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
                
            } else {
                let res = await axios.post(`${API_URL}/auth/customer`, {
                    email: email,
                    password: password,
                });
                console.log("data from LOGIN", res.data);

                if (res.data.success) {
                    // alert("Login Successfull");
                    toast({
                        title: `${res.data.message}`,
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    });
                    localStorage.setItem("Gadgetwarehouse_userlogin", res.data.token);
                    dispatch(loginAction(res.data));
                    navigate("/", { replace: true });
                }
            }
        } catch (error) {
            console.log(error);
            // alert(error.response.data.message);
            toast({
                title: `Login Failed`,
                description: `Email or Password wrong`,
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <section className='form bg-bgglass rounded-[20px] shadow-sm shadow-yellow-50 box-border w-[320px] p-5 mt-24 mb-8 m-auto hover:scale-105 duration-500'>
            <div className='flex flex-col gap-3'>
                <h1 className='text-[#1BFD9C] font-bold text-3xl text-center'>Welcome</h1>
                <h1 className='text-white font-bold text-lg '>Ready for shopping?</h1>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='font-semibold text-emerald-300'>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Your Email' className='rounded-xl px-2 bg-transparent border border-emerald-300 text-white outline-none hover:scale-105 duration-300' />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='font-semibold text-emerald-300'>Password</label>
                    <div className='flex hover:scale-105 duration-300'>
                        <input onChange={(e) => setPassword(e.target.value)} type={visible} placeholder='Your Password' className='rounded-xl rounded-tr-none rounded-br-none w-full px-2 bg-transparent border border-emerald-300  text-white outline-none ' />
                        <button className='bg-transparent h-[26px] px-1 text-xl rounded-tr-xl rounded-br-xl border border-emerald-300 text-[#1BFD9C]' type='button' onClick={klik}> {visible === 'password' ? <HiEyeOff /> : <HiEye />}</button>
                    </div>
                </div>

                <button type='button' className='text-white bg-emerald-400 font-bold border border-[#1BFD9C] rounded-xl w-1/2 mx-auto mt-4 hover:bg-emerald-300 hover:border-white hover:text-black duration-500 hover:scale-110' onClick={onBtnLogin}>Login</button>
                <p className='text-center font-bold text-white'>-- or Sign in with --</p>
                <div className='flex justify-evenly py-2'>
                    <button className='bg-slate-200 border-2 border-[#1BFD9C] w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-110 duration-500'><FcGoogle className='m-auto' /></button>
                    <button className='bg-slate-200 border-2 border-[#1BFD9C] w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-110 duration-500'><BsFacebook className='m-auto' /></button>
                </div>
                <p className='font-semibold text-white'>forgot your <NavLink to='/request' className='text-[#1BFD9C] hover:scale-110 duration-500'>password</NavLink> ? </p>
            </div>
        </section>
    )
}

export default Login