import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { BsFacebook } from 'react-icons/bs'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginAction } from "../reducers/auth";
import { API_URL } from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '@chakra-ui/react';

function Register() {

    const toast = useToast();
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const [email, setEmail] = useState("");
    // const [password, setPassword] = React.useState("");

    const onBtnRegis = async () => {
        try {
            let res = await axios.post(`${API_URL}/auth/customer/register`, {
                email: email,
            }
            );
            if (res.data.success) {
                toast({
                    title: `${res.data.message}`,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log("error", error);
            toast({
                title: `${error.response.data.error[0].msg}`,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }

    }
    return (
        <section className='form bg-bgglass rounded-[20px] shadow-sm shadow-yellow-50 box-border w-[320px] p-5 mt-24 mb-8 m-auto hover:scale-110 duration-500'>
            <div className='flex flex-col gap-4'>
                <h1 className='text-[#1BFD9C] font-bold text-3xl text-center'>Welcome</h1>
                <h1 className='text-white font-bold text-lg '>Let's create your account</h1>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='font-semibold text-emerald-300'>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Your Email' className='rounded-xl px-2 bg-transparent border border-emerald-300 text-white outline-none hover:scale-105 duration-300' />
                </div>

                <button type='button' className='text-[#1BFD9C] bg-transparent font-bold border border-[#1BFD9C] rounded-xl w-1/2 mx-auto mt-4 hover:bg-[#1BFD9C] hover:border-white hover:text-white duration-500 hover:scale-110' onClick={onBtnRegis}>Register</button>
                <p className='text-center font-bold text-white'>-- or Register with --</p>
                <div className='flex justify-evenly py-2'>
                    <button className='bg-slate-200 border-2 border-[#1BFD9C] w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-110 duration-500'><FcGoogle className='m-auto' /></button>
                    <button className='bg-slate-200 border-2 border-[#1BFD9C] w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-110 duration-500'><BsFacebook className='m-auto' /></button>
                </div>
            </div>

        </section>

    )
}

export default Register