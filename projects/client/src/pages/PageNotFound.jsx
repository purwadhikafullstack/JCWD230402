import React from 'react'
import './PageNotFound.scss'
import { NavLink } from 'react-router-dom'
import { Flex, Spinner } from '@chakra-ui/react';

function Pagenotfound() {

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      {loading === true ? (
        <Flex
          justifyContent={"center"}
          my={{ base: "24", md: "96" }}
          color={"white"}
          maxW={"100vw"}
          mx={"auto"}
        >
        </Flex>
      ) : (
        <div className='body w-full h-screen'>
          <div id="app">
            <div id="wrapper" className='flex flex-col gap-4 items-center'>
              <h1 class="glitch" data-text="404 not found">404 not found</h1>
              <button type='button' className='bg-[#1BFD9C] w-1/4 text-white font-bold text-2xl rounded-2xl hover:text-black hover:scale-110 duration-500 '><NavLink to='/'>Back Home</NavLink></button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Pagenotfound