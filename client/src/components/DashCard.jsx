import React from 'react'
import { FaHeadphones } from 'react-icons/fa'
import { FaPlay } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const DashCard = ({ index, data, handleOpenPlayer }) => {

    const { openplayer } = useSelector(state => state.audioplayer);
    const navigate = useNavigate();

    const handleOpen = () => {
        if (openplayer) {
            handleOpenPlayer(data._id, data.type, index);
        } else {
            navigate("/signin");
        }
    }
    return (
        <div key={index} className='bg-black p-4 group rounded-md relative cursor-pointer hover:-translate-y-2 transition-all duration-300' onClick={handleOpen}>
            <img src={data.img} alt="" className='w-full h-[160px] object-fill rounded-md' />
            <div className='pt-2'>
                <h1 className='text-lg'>{data.name}</h1>
                <p className='text-md'>{data.desc}</p>
            </div>
            <div className='pt-3 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <img src={data.creator.img} height={30} width={30} className='rounded-full' alt="" />
                    <h1>{data.creator.name}</h1>
                </div>

                <div className='text-sm'>
                    {data.views} views
                </div>
            </div>

            <div className='hidden group-hover:block absolute right-[1.5rem] top-[10rem] p-3 bg-[rgb(190,26,219)]  rounded-full transition-all ease-in-out duration-700 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]'>
                {data.type === "audio" ? <FaHeadphones size={24} /> : <FaPlay size={24} />}
            </div>
        </div>

    )
}

export default DashCard
