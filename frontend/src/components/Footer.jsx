
import React from 'react'

const Footer = () => {
    return (
        // <div className='bg-slate-800 text-white flex flex-col justify-center items-center  w-full'>
        <div className='bg-slate-800 text-white flex flex-col justify-center items-center w-full min-h-[4rem] py-2 px-4'>
            <div className="logo font-bold text-white text-xl sm:text-2xl">
                <span className='text-green-500'> &lt;</span>
                <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
            </div>
            <div className='flex justify-center items-center text-xs sm:text-sm'> 
                Created with <img className='w-5 mx-1.5' src="icons/heart.png" alt="heart" /> by SalmanYourBuddy
            </div>
        </div>
    )
}

export default Footer
