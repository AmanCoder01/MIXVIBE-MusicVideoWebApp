import React, { useEffect, useState } from 'react'
import { FaHeadphones } from 'react-icons/fa'
import { FaPlay } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { server } from '../service/server';
import axios from 'axios';
import { FaHeart } from "react-icons/fa";
import { setUserProfile } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';




const DashCard = ({ index, data, handleOpenPlayer, userData }) => {

    const [fav, setFav] = useState(false);

    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOpen = () => {
        if (user) {
            handleOpenPlayer(data._id, data.type, index);
        } else {
            navigate("/signin");
        }
    }


    const handleLike = async (id) => {
        // console.log(id);

        try {
            const res = await axios.post(`${server}/content/favorite/`, { id: id }, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                setFav(!fav)
            } else {
                toast.error(res.data.message)
            }


        } catch (err) {
            toast.error(err.response.data.message)

        }

    }

    useEffect(() => {
        //favorits is an array of objects in which each object has a podcast id match it to the current podcast id
        if (userData?.favorites?.find((fav) => fav._id === data._id)) {
            setFav(true);
        }
    }, [userData])



    return (
        <div key={index} className='bg-black p-4 group rounded-md relative cursor-pointer hover:-translate-y-2 transition-all duration-300' >
            <div onClick={handleOpen}>
                <img src={data.img} alt="" className='w-full h-[160px] object-fill rounded-md' />
                <div className='pt-2'>
                    <h1 className='text-lg'>{data.name}</h1>
                    <p className='text-md'>{data.desc}</p>
                </div>
                <div className='pt-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <img src={data.creator.img} height={28} width={28} className='rounded-full' alt="" />
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

            <div className='absolute top-4 right-4 bg-gray-800 rounded-full p-2' onClick={() => handleLike(data?._id)}>
                {fav ? <FaHeart size={18} color='red' /> : <FaRegHeart size={18} />}
            </div>
        </div>

    )
}

export default DashCard
