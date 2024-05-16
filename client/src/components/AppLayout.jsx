import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux';
import AudioPlayer from './AudioPlayer';

const AppLayout = ({ children }) => {
    const { sidebar } = useSelector(state => state.auth);

    return (
        <div className='w-full h-screen flex items-center text-white' >
            <div className={`h-full  z-40 bg-[#15171E] ${sidebar ? "hidden" : "w-[20%]"}`}>
                <Sidebar />
            </div>


            <div className={`flex flex-col justify-center  h-full bg-[rgb(28,30,39)]  ${sidebar ? "w-full" : "w-[80%]"}`}>
                <div className={`fixed z-50 top-0 h-[4rem]  ${sidebar ? "w-full" : "md:w-[calc(100%-20%)]"}`}>
                    <Header />
                </div>
                <div className='h-full  mt-12 '>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default AppLayout
