import React, {useEffect, useState} from 'react'
import {BsChevronCompactLeft, BsChevronCompactRight} from 'react-icons/bs'
import {RxDotFilled} from 'react-icons/rx'
function Carousel1() {
    const slides =[
        {
            url:'https://fdn.gsmarena.com/imgroot/news/22/09/iphone-14-launch-hot-take/inline/-1200/gsmarena_001.jpg'
        },
        {
            url:'https://asset-a.grid.id/crop/0x0:0x0/x/photo/2021/10/19/lcimg-cc0bd662-abc4-4dd0-a63c-6e-20211019012322.jpg'
        },
        {
            url:'https://assets-prd.ignimgs.com/2022/09/07/apple-watch-s8-nike-7up-hero-220907-1662580135850.png'
        },
    ];

const [currentIndex, setCurrentIndex]= useState(0)

const prevSlide =()=>{
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex -1;
    setCurrentIndex(newIndex)
}
const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length -1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
}
const goToSlide =(slideIndex) =>{
    setCurrentIndex(slideIndex)

};


  return (
    <div className='container md:max-w-[1400px] h-[300px] md:h-[600px] w-full m-auto py-16 px-4 relative group'>
        <div style={{backgroundImage:`url(${slides[currentIndex].url})`}} className='image w-full h-full rounded-2xl object-cover bg-cover bg-repeat-space bg-center duration-500 overflow-hidden'></div>
    {/* left arrow */}
    <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
    <BsChevronCompactLeft onClick={prevSlide} size={30} />
    </div>
    {/* rigth arrow */}
    <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
    <BsChevronCompactRight onClick={nextSlide} size={30} />
    </div>
    <div className='flex top-4 justify-center py-2'>
        {slides.map((slide, slideIndex)=>(
            <div key={slideIndex} onClick={()=> goToSlide(slideIndex)} className='text-2xl cursor-pointer'>
                <RxDotFilled />
            </div>
        ))}

    </div>
    </div>
  )
}

export default Carousel1