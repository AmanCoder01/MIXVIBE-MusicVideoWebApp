import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import axios from 'axios'
import { server } from '../service/server'
import { FaHeadphones } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { openPlayer } from '../redux/slices/audioPlayerSlice';
import DashCard from '../components/DashCard';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    const [mostPopular, setMostPopular] = useState([]);
    const [mostPopularVideo, setMostPopularVideo] = useState([]);
    const dispatch = useDispatch();

    const getPopularPodcast = async () => {
        try {
            const res = await axios.get(`${server}/content/mostpopular`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                setMostPopular(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getPopularVideo = async () => {
        try {
            const res = await axios.get(`${server}/content/mostpopularvideo`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                setMostPopularVideo(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPopularPodcast();
        getPopularVideo();
    }, [])


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


    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='p-6 md:p-8 my-10'>


                    <div className='mb-12'>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-xl md:text-2xl font-bold'>Most Popular Songs</h1>
                            <Link to="/showsong/mostpopular" className='text-lg text-[rgb(190,26,219)]'>Show More...</Link>
                        </div>

                        <div className='grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                            {
                                mostPopular?.slice(0, 9).map((data, index) => (
                                    <DashCard index={index} key={index} data={data} handleOpenPlayer={handleOpenPlayer} />
                                )

                                )}
                        </div>
                    </div>





                    <div className='mb-12 '>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-xl md:text-2xl  font-bold'>Most Popular Videos</h1>
                            <Link to="/showvideo/mostpopular" className='text-lg text-[rgb(190,26,219)]'>Show More...</Link>
                        </div>

                        <div className='grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                            {
                                mostPopularVideo?.slice(0, 9).map((data, index) => (
                                    <DashCard index={index} key={index} data={data} handleOpenPlayer={handleOpenPlayer} />
                                )
                                )}
                        </div>
                    </div>




                </div>
            </div>
        </AppLayout>
    )
}

export default Dashboard
