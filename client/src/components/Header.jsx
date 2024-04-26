import React from 'react'
import { IoMenuSharp } from "react-icons/io5";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { setSidebar } from '../redux/slices/authSlice';


const Header = () => {
    const { user, sidebar } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return (
        <div className='w-full z-50 flex justify-between px-2 md:px-12 items-center py-[1rem]'>
            <button onClick={() => dispatch(setSidebar(!sidebar))} className='block md:hidden'>
                <IoMenuSharp size={28} />
            </button>

            {user && <h1 className='text-md md:text-xl font-semibold'>Welcome , {user.name}</h1>}

            <div>
                {
                    user ? (
                        <Link to="/profile">
                            <img src={user.img} width={36} height={36} className='rounded-full' alt="" />
                        </Link>
                    ) :
                        (
                            <button className='border px-3 rounded-lg py-[0.2rem] text-[rgb(190,26,219)] border-[rgb(190,26,219)]'>
                                <Link to="/signin" className='flex items-center gap-2'>
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
