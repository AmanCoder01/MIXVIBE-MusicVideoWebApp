import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../service/server';
import toast from 'react-hot-toast';
import { MdDelete } from "react-icons/md";
import moment from "moment";


const Profile = () => {

    const { user } = useSelector(state => state.auth);
    const { id } = useParams();
    const [contentData, seContentData] = useState([]);


    const fetchData = async () => {
        try {
            const res = await axios.get(`${server}/profile/${id}`, { withCredentials: true });
            console.log(res);

            if (res.status === 200) {
                seContentData(res.data);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log('Error: ', err)
        }
    }


    useEffect(() => {
        fetchData();
    }, [])




    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='p-6 md:p-8 my-10'>
                    <div className='flex items-center gap-6 flex-wrap'>
                        <img src={user?.img} alt="" className='h-[150px] rounded-full' />

                        <div>
                            <h1 className='text-2xl'>{user?.name}</h1>
                            <span>Email : <span className='text-[rgb(190,26,219)]'> {user?.email}</span></span>
                        </div>
                    </div>


                    <div className='border my-8 border-gray-700'></div>


                    <div>
                        <h1 className='text-xl'>Your Uploads</h1>


                        <div className='my-8 flex flex-col gap-4'>
                            {
                                contentData?.length === 0 ?
                                    <span className="text-white text-center">No uploads yet!</span> :
                                    contentData?.map((item, index) => {
                                        return <div key={index} className='flex gap-4 bg-black p-2 px-4 rounded-md justify-between'>
                                            <div className='flex gap-4'>
                                                <img src={item?.img} alt="" className='h-[50px] w-[50px] md:h-[80px] md:w-[80px] rounded-md' />
                                                <div className='flex flex-col justify-center '>
                                                    <h1 className='text-lg md:text-xl'>{item?.name}</h1>
                                                    <h1 className='text-sm md:text-md'>{item?.desc}</h1>
                                                    <span className='text-sm text-gray-300'>Views: {item?.views}</span>
                                                </div>
                                            </div>

                                            <div className='cursor-pointer flex flex-col items-center gap-4'>
                                                <MdDelete size={25} />
                                                <span className='text-sm'>{moment(item?.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                    })
                            }
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export default Profile
