import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import axios from 'axios'
import { server } from '../service/server'
import moment from "moment";
import toast from 'react-hot-toast';

const ArtistApprove = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);

    const fetchArtist = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}/profile/artistsRequest`, { withCredentials: true });

            console.log(res);
            if (res.status === 200) {
                setLoading(false);
                setData(res.data);
            }

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }



    useEffect(() => {
        fetchArtist();
    }, [])


    const approveRequest = async (id) => {
        try {
            const res = await axios.post(`${server}/profile/approverequest/${id}`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                toast.success(res.data.message);
                setData(data.filter((item) => item._id !== id));
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }
    const declineRequest = async (id) => {
        try {
            const res = await axios.post(`${server}/profile/declinerequest/${id}`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                toast.success(res.data.message);
                setData(data.filter((item) => item._id !== id));
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }

    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='py-6 md:py-9 px-7 md:px-12 my-6 text-center'>
                    <h1 className="text-white text-xl font-bold mb-2">Artist Approval</h1>
                    {
                        loading ? <p className="loader    mx-auto w-full flex justify-center items-center my-12"></p>

                            :

                            data?.length === 0 ? <h1>No Pending Request</h1>

                                :

                                <div className='flex flex-col justify-center py-6 gap-3' >
                                    {data?.map((item, index) => (
                                        <div key={index} className='max-w-3xl  w-full mx-auto bg-black  rounded-md py-4 px-6 flex items-center justify-between flex-wrap'>
                                            <h1 className=' font-semibold '>{item.name}</h1>

                                            <p className='italic text-sm text-gray-400'>{item?.email}</p>
                                            <p className='italic text-sm text-gray-400'>{moment(item?.createdAt).from()}</p>

                                            <div className='flex items-center gap-4'>
                                                <button className='bg-red-500 px-2 py-1 rounded-md'
                                                    onClick={() => declineRequest(item?._id)}>Decline</button>
                                                <button className='bg-[rgb(190,26,219)] px-2 py-1 rounded-md'
                                                    onClick={() => approveRequest(item?._id)}
                                                >Accept</button>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                    }
                </div>
            </div>

        </AppLayout>
    )
}

export default ArtistApprove
