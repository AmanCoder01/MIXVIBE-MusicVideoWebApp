import React from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import { SiYoutubemusic } from "react-icons/si";
import { MdHome } from "react-icons/md";
import { MdCloudUpload } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { server } from "../service/server"
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { setUserProfile } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { openPlayer } from '../redux/slices/audioPlayerSlice';


const Sidebar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
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

    return (
        <div className=''>
            <Link to="/" className='text-xl mb-3 p-4 text-[rgb(190,26,219)] flex items-center gap-2'>
                <SiYoutubemusic size={30} />
                MIXVIBE</Link>

            <div className='flex flex-col justify-center'>
                <Link to="/" className='hover:bg-gray-700 w-full py-4 text-lg  cursor-pointer'>
                    <div className='px-4 flex items-center gap-4'>
                        <MdHome size={24} />
                        <p>Dashboard</p>
                    </div>
                </Link>
                <div className='hover:bg-gray-700  w-full py-4 text-lg  cursor-pointer'>
                    <div className='px-4 flex items-center gap-4'>
                        <IoSearchSharp size={24} />
                        Search
                    </div>
                </div>
                <div className='hover:bg-gray-700  w-full py-4 text-lg  cursor-pointer'>
                    <div className='px-4 flex items-center gap-4'>
                        <FaHeart size={20} />
                        Favourites
                    </div>
                </div>



                <div className='h-0 w-full border my-4 border-[rgba(177,178,179,0.314)]'></div>

                {user?.isAdmin && <Link to="/upload" className='hover:bg-gray-700  w-full py-4 text-lg  cursor-pointer'>
                    <div className='px-4 flex items-center gap-4'>
                        <MdCloudUpload size={24} />
                        Upload
                    </div>
                </Link>}
                {user && <div className='hover:bg-gray-700  w-full py-4 text-lg cursor-pointer' onClick={handleLogout}>
                    <div className='px-4 flex items-center gap-4'>
                        <IoLogOutOutline size={24} />
                        Logout
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Sidebar
