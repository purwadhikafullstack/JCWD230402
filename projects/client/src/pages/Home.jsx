import React from 'react'
import { Carousel, HomeContainer, Product, ScrollProduct, Limited} from '../components'

function Home() {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>
      <HomeContainer />
      <Carousel />
      <ScrollProduct />
      <Limited/>
      <Product />
    </div>
  )
}

export default Home