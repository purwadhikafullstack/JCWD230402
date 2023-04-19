import React from 'react'
import { BsTrash } from 'react-icons/bs'

function CardCart() {
    return (
        <div className='mt-20 mb-3'>
            <div className='w-80 bg-bgglass shadow rounded-xl md:flex-col flex justify-between'>
                <div className='flex flex-col p-2'>
                <div className='md:h-48 h-24 w-full bg-gray-200 flex flex-col justify-between p-4 bg-cover bg-center rounded-xl'>
                </div>
                <div className="flex justify-between items-center gap-2 md:gap-0 p-4">
                        <input type="checkbox" />
                        <span className="uppercase h-auto text-xs bg-bgglass p-0.5 border-green-500 border rounded text-[#1BFD9C] font-medium select-none">
                            available
                        </span>
                    </div>
                    </div>

                <div class="md:p-4 p-1 flex flex-col items-center">
                    <p class="text-[#1BFD9C] font-light text-xs text-center">
                        Category Product
                    </p>
                    <h1 class="text-[#1BFD9C] text-center mt-1">Item name</h1>
                    <p class="text-center text-[#1BFD9C] mt-1">$1299</p>
                    <div class="inline-flex items-center mt-2">
                        <button
                            class="bg-bgglass rounded-l border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M20 12H4"
                                />
                            </svg>
                        </button>
                        <div
                            class="bg-bgglass border-t border-b border-gray-100 text-[#1BFD9C] hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none"
                        >
                            1
                        </div>
                        <button
                            class="bg-bg-glass rounded-r border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                    </div>

                    <button
                        class="md:py-2 md:px-4 bg-emerald-400 text-white hover:text-black rounded-xl hover:bg-emerald-300 hover:scale-105 duration-500 active:bg-emerald-500 disabled:opacity-50 mt-4 w-full flex items-center justify-center gap-4"
                    >
                        Cancel
                        <BsTrash />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardCart