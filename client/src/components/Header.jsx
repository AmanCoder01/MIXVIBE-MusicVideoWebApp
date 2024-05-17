import React from 'react'
import { IoMenuSharp } from "react-icons/io5";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { setSidebar } from '../redux/slices/authSlice';
import axios from "axios";
import { server } from '../service/server';
import toast from "react-hot-toast";
import { SiYoutubemusic } from 'react-icons/si';


const Header = () => {
    const { user, sidebar } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleArtist = async () => {
        try {
            const res = await axios.post(`${server}/profile/sendrequest/${user?._id}`, { withCredentials: true });
            if (res.status === 200) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);

        }
    }

    return (
        <div className='w-full z-50 flex justify-between px-2 md:px-8 items-center py-[1rem]'>
            {/* <button onClick={() => dispatch(setSidebar(!sidebar))} className=''>
                <IoMenuSharp size={28} />
            </button> */}

            <Link to="/" className='text-xl text-[rgb(190,26,219)] flex items-center gap-2'>
                <SiYoutubemusic size={30} />
                MIXVIBE
            </Link>

            {user && <h1 className='text-md md:text-xl font-semibold hidden md:block'>Welcome , {user.name}</h1>}

            <div>
                {
                    user ? (


                        <div className='flex items-center gap-8'>

                            {user?.role === "user" &&

                                <button className='border px-3 rounded-lg py-[0.2rem] text-[rgb(190,26,219)] border-[rgb(190,26,219)]' onClick={handleArtist}>Become Artist</button>
                            }


                            <Link to={`/profile/${user._id}`}>
                                <img src={user.img} width={36} height={36} className='rounded-full' alt="" />
                            </Link>

                        </div>


                    ) :
                        (
                            <button className='border px-3 rounded-lg py-[0.2rem] text-[rgb(190,26,219)] border-[rgb(190,26,219)]'>
                                <Link to="/signin" className='flex  items-center gap-2'>
                                    <FaUser size={15} />
                                    Login</Link>
                            </button>
                        )
                }
            </div >
        </div >
    )
}

export default Header
