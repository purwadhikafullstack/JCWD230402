import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Auth.css'
import { FcGoogle } from 'react-icons/fc'
import { BsFacebook } from 'react-icons/bs'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginAction } from "../reducers/auth";
import { API_URL } from '../helper';

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState('');

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
            if (email == "" || password == "") {
                alert("Please enter your credentials");
            } else {
                let res = await axios.post(`http://localhost:2000/user/auth`, {
                    email: email,
                    password: password,
                });
                console.log("data from LOGIN", res.data);

                alert("Login Successfull");
                localStorage.setItem("", res.data.token);
                dispatch(loginAction(res.data));
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    };

    const onBtnRegis = async () => {
        try {
            let res = await axios.post(`${API_URL}/auth/customer/register`, { 
                email: email,
            }
            );
            console.log("ini dari btn regis",res);
            if (res.data.success) {
                alert({
                    position: 'top',
                    title: `Register Success`,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            }
        } catch (error) {
            console.log("error",error);
            alert(error.response.data.message);
            alert({
                position: 'top',
                title: `${error.response.data.message}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }

    }

    // const onBtnRegis = () => {
    //     alert("ini regis")
    // }
    return (
        <section className='flex justify-center items-center py-10'>
            <div className="main w-[350px] h-[500px] overflow-hidden rounded-[10px] bg-white">
                <input type="checkbox" id="chk" aria-hidden="true" />

                <div className="signup relative w-full h-full bg-white">

                    {/* register */}

                    <form>
                        <label className='signuplbl text-emerald-400 text-[2.3em] flex justify-center m-[60px] font-bold cursor-pointer duration-700' for="chk" aria-hidden="true">
                            Sign up
                        </label>

                        {/* email */}
                        <input onChange={(e) => setEmail(e.target.value)} className='signupinput w-[60%] h-[20px] bg-[#e0dede] justify-center flex my-[10px] mx-auto p-3 border-none outline-none rounded-[5px]' type="email" name="email" placeholder="Email" required="" />

                        {/* signup button */}
                        <button type='button' className='authbtn w-[60%] h-[40px] my-3 mx-auto justify-center block text-white bg-emerald-300 hover:bg-emerald-400 text-[1em] font-bold mt-5 outline-none border-none rounded-[5px] cursor-pointer' onClick={onBtnRegis}>Sign up</button>
                        <p className='text-center font-bold text-black'>-- or Sign up with --</p>
                        <div className='flex justify-evenly py-2'>
                            <button className='bg-slate-200 border-2 border-slate-400 w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-105 duration-500'><FcGoogle className='m-auto' /></button>
                            <button className='bg-slate-200 border-2 border-slate-400 w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-105 duration-500'><BsFacebook className='m-auto' /></button>
                        </div>
                    </form>
                </div>

                {/* login */}

                <div className="login h-[460px] bg-gradient-to-bl from-slate-800 to-slate-600">
                    <form>
                        <label className='loginlbl text-emerald-400 text-[2.3em] flex justify-center m-[60px] font-bold cursor-pointer duration-700' for="chk" aria-hidden="true">
                            Login
                            </label>
                        
                        {/* email*/}
                        <input className='logininput w-[60%] h-[20px] bg-[#e0dede] justify-center flex my-[10px] mx-auto p-3 border-none outline-none rounded-[5px]' type="email" name="email" placeholder="Email" required="" />

                        {/* password */}
                        <div className='flex justify-center items-center'>
                            <input className='signupinput w-[55%] h-[20px] bg-[#e0dede] justify-center flex my-[5px]  p-3 border-none outline-none rounded-tl-[5px] rounded-bl-[5px]' type={visible} name="pswd" placeholder="Password" required="" />
                            <button className='bg-[#e0dede] h-[24px] text-xl rounded-tr-[5px] rounded-br-[5px]' onClick={klik}>{visible ? <HiEyeOff /> : <HiEye />}</button>
                        </div>

                        {/* login button */}
                        <button className='authbtn w-[60%] h-[40px] my-3 mx-auto justify-center block text-white bg-emerald-300 hover:bg-emerald-400 text-[1em] font-bold mt-5 outline-none border-none rounded-[5px] cursor-pointer' onClick={onBtnLogin}>Login</button>
                        <p className='text-center font-bold text-white'>-- or login with --</p>
                        <div className='flex justify-evenly py-2'>
                            <button className='bg-white w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-105 duration-500'><FcGoogle className='m-auto' /></button>
                            <button className='bg-white w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-105 duration-500'><BsFacebook className='m-auto' /></button>
                        </div>
                        <p className='flex justify-start px-8 gap-2 font-bold py-2'>Forgot your <NavLink className="text-blue-600 hover:scale-105" to='/Forgot'>Password</NavLink></p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Auth