import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../service/server';
import toast from 'react-hot-toast';
import { MdDelete } from "react-icons/md";
import moment from "moment";
import { RxCross2 } from "react-icons/rx";
import { FaCrown } from "react-icons/fa";



const Profile = () => {

    const { user } = useSelector(state => state.auth);
    const { id } = useParams();
    const [contentData, setContentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        isOpen: false,
        id: ""
    });



    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}/profile/${id}`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                setLoading(false);
                setContentData(res.data.contents);
            } else {
                toast.error(res.data.message);
                setLoading(false);

            }
        } catch (err) {
            console.log('Error: ', err)
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchData();
    }, [])



    const handleConfirm = async (id) => {
        try {
            const res = await axios.delete(`${server}/content/delete/${id}`, { withCredentials: true });

            setContentData(contentData.filter((item) => item._id !== id));
            setModal({ isOpen: false, id: '' })
            toast.success(res.data.message);

        } catch (error) {
            setModal({ isOpen: false, id: '' })
            console.log(error);
        }
    }



    return (
        <AppLayout>
            <div className={`w-full h-full bg-[rgb(28,30,39)]  overflow-auto  relative ${modal?.isOpen && "bg-opacity-20 overflow-hidden"}`}>
                <div className='p-6 md:p-8 mt-10'>
                    <div className='flex items-center gap-6 flex-wrap'>
                        <img src={user?.img} alt="" className='h-[150px] rounded-full' />

                        <div>
                            <div className='relative'>
                                <h1 className='text-2xl '>{user?.name} </h1>
                                <p className='text-xs absolute top-[-6px] right-0 bg-red-500 p-[2px] rounded-xl px-3 flex  items-center gap-2'> {user?.role === "admin" && <FaCrown />}{user?.role}</p>
                            </div>
                            <span>Email : <span className='text-[rgb(190,26,219)]'> {user?.email}</span></span>
                        </div>
                    </div>


                    <div className='border my-8 border-gray-700'></div>


                    <div className='h-screen'>
                        <h1 className='text-xl'>Your Uploads</h1>


                        <div className='my-8 flex flex-col gap-4 overflow-auto h-[80%] border-gray-500 border-2 rounded-lg'>
                            {loading ? <p className="loader    mx-auto w-full flex justify-center items-center my-12"></p> :
                                contentData?.length === 0 ?
                                    <span className="text-white text-center">No uploads yet!</span> :
                                    contentData?.map((item, index) => {
                                        return <div key={index} className='flex gap-4 bg-black p-2 px-4 rounded-md justify-between max-h-[100px]'>
                                            <div className='flex gap-4'>
                                                <img src={item?.img} alt="" className='h-full w-[50px] md:h-[80px] md:w-[80px] rounded-md' />
                                                <div className='flex flex-col justify-center '>
                                                    <h1 className='text-lg md:text-xl'>{item?.name.slice(0, 10)}...</h1>
                                                    <h1 className='text-sm md:text-md'>{item?.artist.slice(0, 10)}</h1>
                                                    <span className='text-[0.7rem] md:text-sm text-gray-300'>Views: {item?.views}</span>
                                                </div>
                                            </div>

                                            <div className='cursor-pointer flex flex-col items-center gap-4 py-2'>
                                                <MdDelete size={25} onClick={() => setModal({
                                                    isOpen: true,
                                                    id: item?._id
                                                })} />
                                                <span className='text-[0.7rem] md:text-sm'>{moment(item?.createdAt).fromNow()}</span>
                                            </div>

                                        </div>
                                    })
                            }
                        </div>




                    </div>
                </div>


                {modal?.isOpen &&
                    <div className='absolute top-[50%] h-[200px]  right-[50%] translate-x-52 duration-300 transition-all bg-black w-[400px] p-4 rounded-xl z-50'>
                        <div className='flex justify-end cursor-pointer w-full text-right' onClick={() => setModal({
                            isOpen: false,
                            id: ""
                        })}>
                            <RxCross2 color='white' size={24} />
                        </div>
                        <div className='px-6'>
                            <h1 className='my-6 text-lg font-normal' >Are  you sure ,You want to delete?</h1>

                            <div className='flex items-center justify-between'>
                                <button className='bg-[rgb(190,26,219)] py-1 px-2 rounded-md' onClick={() => setModal({
                                    isOpen: false,
                                    id: ""
                                })}>Cancel</button>
                                <button className='bg-[rgb(190,26,219)] py-1 px-2 rounded-md' onClick={() => handleConfirm(modal.id)}>Yes</button>
                            </div>
                        </div>
                    </div>
                }
            </div>

        </AppLayout>
    )
}

export default Profile
