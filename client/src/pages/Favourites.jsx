import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import DashCard from '../components/DashCard'
import axios from 'axios';
import { server } from '../service/server';
import { useSelector } from 'react-redux';

const Favourites = () => {
    const [userData, setUserData] = useState();
    const { user } = useSelector((state) => state.auth);



    const addviewtToPodcast = async (id) => {
        try {
            const res = await axios.post(`${server}/content/addview/${id}`, { withCredentials: true });

            // console.log(res);

        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenPlayer = async (id, type, index) => {
        await addviewtToPodcast(id);

        if (type === "audio") {
            //open audio player
            dispatch(
                openPlayer({
                    openPlayer: true,
                    type: "audio",
                    index: index,
                    currenttime: 0,
                    episode: mostPopular
                })
            )
        } else {
            //open video player
            dispatch(
                dispatch(
                    openPlayer({
                        type: "video",
                        podid: podid,
                        index: index,
                        currenttime: 0
                    })
                )
            )
        }

    }


    const getUser = async () => {
        try {
            const res = await axios.get(`${server}/profile/${user._id}`, { withCredentials: true });
            console.log(res);
            setUserData(res.data)

        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getUser();
    }, [])




    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='py-6 md:py-9 px-7 md:px-12 my-6 mb-14'>
                    <h1 className='text-xl font-semibold'>Favourites</h1>

                    <div className=' grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4 mt-6'>
                        {
                            userData?.favorites?.slice(0, 8).map((data, index) => {
                                return <DashCard index={index} key={index} userData={userData} data={data} handleOpenPlayer={handleOpenPlayer} />
                            })
                        }
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Favourites
