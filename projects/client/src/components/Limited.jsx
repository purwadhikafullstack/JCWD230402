import React, { useEffect, useState } from 'react'
import Iphone14 from "../img/Iphone14.png"


function Limited() {

    const [days, setDays] = useState();
    const [hours, setHours] = useState();
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();

    let interval;

    const countDown = () => {
        const destination = new Date('June 12, 2023').getTime()
        interval = setInterval(() => {
            const now = new Date().getTime()
            const different = destination - now;
            const days = Math.floor(different / (1000 * 60 * 60 * 24));
            const hours = Math.floor(different % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            const minutes = Math.floor(different % (1000 * 60 * 60) / (1000 * 60));
            const seconds = Math.floor(different % (1000 * 60) / 1000);

            if (destination < 0) clearInterval(interval.current)
            else {
                setDays(days)
                setHours(hours)
                setMinutes(minutes)
                setSeconds(seconds)
            }
        });
    };

    useEffect(() => {
        countDown()
    }, [])
    return (
        <section className='timer_count bg-bgglass backdrop-blur w-full md:h-[250px] flex flex-col md:flex-row justify-between items-center rounded-xl py-2 md:py-4 px-2 md:px-8 gap-x-2 gap-y-2 md:gap-y-0'>
            <div className='clock_top_content flex md:flex-col gap-x-4 md:gap-y-6'>
                <h4 className='text-base md:text-2xl font-bold text-[#1BFD9C]'>Limited Offers</h4>
                <h3 className='text-base md:text-2xl font-bold text-[#1BFD9C]'>Iphone14</h3>
                <button className="buy_button bg-emerald-400 text-white font-bold text-sm md:text-2xl px-2 py-1 rounded-xl animate-pulse hover:scale-110 hover:text-black hover:animate-none hover:bg-emerald-300 duration-500">Grab Now!!</button>
            </div>
            <div className='clock_wrapper flex items-center gap-1 md:gap-5'>
                <div className="clockdata flex items-center gap-3 md:gap-5">
                    <div className='text-center'>
                        <h1 className='text-white md:text-2xl text-base'>{days}</h1>
                        <h5 className='text-white text-xs md:text-base'>Days</h5>
                    </div>
                    <span className='text-white md:text-2xl text-base'>:</span>
                    <div className='text-center'>
                        <h1 className='text-white md:text-2xl text-base'>{hours}</h1>
                        <h5 className='text-white text-xs md:text-base'>Hours</h5>
                    </div>
                    <span className='text-white md:text-2xl text-base'>:</span>
                    <div className='text-center'>
                        <h1 className='text-white md:text-2xl text-base'>{minutes}</h1>
                        <h5 className='text-white text-xs md:text-base'>Minute</h5>
                    </div>
                    <span className='text-white md:text-2xl text-base'>:</span>
                    <div className='text-center'>
                        <h1 className='text-white md:text-2xl text-base'>{seconds}</h1>
                        <h5 className='text-white text-xs md:text-base'>Seconds</h5>
                    </div>
                </div>
            </div>

            <div className=''>
                <img src={Iphone14} alt="" className='w-32 h-26 md:w-[350px] md:h-[250px] object-contain hover:scale-150 duration-500' />
            </div>
        </section>
    )
}

export default Limited