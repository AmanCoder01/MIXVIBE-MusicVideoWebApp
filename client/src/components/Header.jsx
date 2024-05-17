import React, { useState } from 'react'
import { IoLogOutOutline, IoMenuSharp, IoSearchSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { FaCaretDown, FaCaretUp, FaHeart, FaUser, FaUserClock } from "react-icons/fa";
import { setSidebar, setUserProfile } from '../redux/slices/authSlice';
import axios from "axios";
import { server } from '../service/server';
import toast from "react-hot-toast";
import { SiYoutubemusic } from 'react-icons/si';
import { motion } from "framer-motion";
import { MdCloudUpload, MdHome } from 'react-icons/md';
import { openPlayer } from '../redux/slices/audioPlayerSlice';



const Header = () => {
    const { user, sidebar } = useSelector((state) => state.auth);

    const [showUserMenu, setShowUserMenu] = useState(false);


    const dispatch = useDispatch();
    const path = useLocation().pathname;



    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${server}/auth/logout`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                toast.success(res.data.message);
                dispatch(setUserProfile(null));
                dispatch(openPlayer({
                    openPlayer: false,
                    type: "audio",
                    podid: null,
                    index: 0,
                    currenttime: 0
                }))
                localStorage.removeItem("persist:root");
                navigate("/signin");
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            // toast.error(error.response.data.message);
            console.log(error);
        }
    }


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


                            <div className='flex items-center gap-1 cursor-pointer'>
                                <Link to={`/profile/${user._id}`}>
                                    <img src={user.img} width={36} height={36} className='rounded-full' alt="" />
                                </Link>




                                <button className='block md:hidden' onClick={() => setShowUserMenu(!showUserMenu)}>
                                    {showUserMenu ?
                                        <FaCaretUp size={24} />
                                        :
                                        <FaCaretDown size={24} />
                                    }
                                </button>
                            </div>
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



            {showUserMenu && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute z-50 right-5 w-200 cursor-pointer "
                >
                    <div className="absolute md:hidden top-[1.8rem] bg-black p-3 -right-[1rem] rounded-lg  transition-all duration-500 z-50 flex justify-center flex-col gap-3">
                        <Link to="/" className={`hover:bg-gray-700 w-full p-2 ${path === "/" && "bg-gray-800"}`}>
                            <div className='px-4 flex items-center gap-4'>
                                <MdHome size={24} />
                                <p>Dashboard</p>
                            </div>
                        </Link>

                        <Link to="/search" className={`hover:bg-gray-700 w-full p-2 ${path === "/search" && "bg-gray-800"}`}>
                            <div className='px-4 flex items-center gap-4'>
                                <IoSearchSharp size={24} />
                                Search
                            </div>
                        </Link>

                        <Link to="/favourites" className={`hover:bg-gray-700 w-full p-2 ${path === "/favourites" && "bg-gray-800"}`}>
                            <div className='px-4 flex items-center gap-4'>
                                <FaHeart size={20} />
                                Favourites
                            </div>
                        </Link>


                        {(user?.role === "artist" || user?.role === "admin") && <Link to="/upload" className={`hover:bg-gray-700 w-full p-2 ${path === "/upload" && "bg-gray-800"}`}>
                            <div className='px-4 flex items-center gap-4'>
                                <MdCloudUpload size={20} />
                                Upload
                            </div>
                        </Link>}

                        {(user?.role === "admin") && <Link to="/approve" className={`hover:bg-gray-700 w-full p-2 ${path === "/approve" && "bg-gray-800"}`}>
                            <div className='px-4 flex items-center gap-4'>
                                <FaUserClock size={20} />
                                Artist_Request
                            </div>
                        </Link>}

                        {user && <div className='hover:bg-gray-700  w-full p-2 cursor-pointer' onClick={handleLogout}>
                            <div className='px-4 flex items-center gap-4'>
                                <IoLogOutOutline size={20} />
                                Logout
                            </div>
                        </div>}
                    </div>
                </motion.div>

            )}

        </div >
    )
}

export default Header
