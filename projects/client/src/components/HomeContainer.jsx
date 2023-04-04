import React from 'react'
import { heroData } from '../utils/data.js'
import heroBg2 from '../img/heroBg2.png'
function HomeContainer() {
    return (
        <section id="home" className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full pt-20'>
            <div className="py-2 flex-1 flex flex-col items-start  justify-center gap-4">
                <div className=' flex  items-center justify-center gap-2 bg-zinc-800 px-4 py-1 rounded-full'>
                    <p className='text-[#1BFD9C] text-medium font-semibold'>GadgetHouse</p>
                    <div className='w-8 h-8 rounded-full overflow-hidden drop-shadow-xl'>
                        <img src="https://keluhkesah.com/wp-content/uploads/2021/06/6.-Pengertian-Gadget-Jenisnya-Dan-Contohnya.jpg" className='w-full h-full object-contain bg-white' alt="" />
                    </div>
                </div>
                <p className='text-[2.5rem] lg:text-[4rem] font-bold tracking-wide text-white'>Your Biggest Gadget Warehouse in <span className='text-[#1BFD9C]  text:-[4rem] lg:text-[5rem]'>Town</span>
                </p>
                <p className='text-medium text-white text-center md:text-left md:w-[80%]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum impedit quod maiores repudiandae! Minima quas alias quo necessitatibus odio nemo doloremque optio accusantium, laudantium error, quod obcaecati! Praesentium, amet. Dolor.</p>
                <button type='button' className='bg-emerald-400 w-full md:w-auto px-4 py-2 font-bold hover:text-white rounded-lg hover:scale-110 duration-500'>Order Now</button>
            </div>
            <div className="py-2 flex-1 flex items-center relative">
                <img className='ml-auto h-[420px] w-full lg:w-[400px] lg:h-[650px] rounded-xl' src={heroBg2} alt="" />

                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center  lg:px-32  py-4 gap-8 md:gap-4 flex-wrap">
                    {heroData &&
                        heroData.map((n) => (
                            <div
                                key={n.id}
                                className="  lg:w-[150px]  p-4 bg-bgglass backdrop-blur rounded-3xl flex flex-col items-center justify-center drop-shadow-lg hover:scale-105 duration-500"
                            >
                                <img
                                    src={n.imageSrc}
                                    className="w-20 lg:w-56 -mt-10 lg:-mt-20 z-40 hover:scale-110 duration-500"
                                    alt="I1"
                                />
                                <p className="text-medium lg:text-xl font-semibold text-white mt-2 lg:mt-4">
                                    {n.name}
                                </p>

                                <p className="text-[12px] lg:text-sm text-white font-semibold my-1 lg:my-3">
                                    {n.decp}
                                </p>

                                <p className="text-sm font-semibold text-white">
                                    <span className="text-sm text-red-600 font-bold">$</span> {n.price}
                                </p>
                            </div>
                        ))}
                </div>
            </div>

        </section>
    )
}

export default HomeContainer