import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux';
import AudioPlayer from './AudioPlayer';

const AppLayout = ({ children }) => {
    const { sidebar } = useSelector(state => state.auth);

    return (
        <div className='w-full h-screen flex items-center text-white' >
            <div className={`fixed z-50 top-0 h-[4rem] w-full bg-[#15171E]`}>
                <Header />
            </div>

            <div className={`flex justify-center items-center w-full  h-full `}>
                <div className={`h-[calc(100%-4rem)]  md:w-[20%]  z-40 bg-[#15171E]`}>
                    <Sidebar />
                </div>

                <div className='h-[calc(100%-4rem)] w-[100%] md:w-[80%] '>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default AppLayout
