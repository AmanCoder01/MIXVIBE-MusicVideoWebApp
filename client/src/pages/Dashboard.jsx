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
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const getPopularPodcast = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${server}/content/mostpopular`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                setMostPopular(res.data);
                setLoading(false);

            }
        } catch (err) {
            console.log(err);
            setLoading(false);

        }
    }

    const getPopularVideo = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}/content/mostpopularvideo`, { withCredentials: true });
            // console.log(res);
            if (res.status === 200) {
                setMostPopularVideo(res.data);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);

        }
    }

    useEffect(() => {
        getPopularPodcast();
        getPopularVideo();
        getUser();

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



    const getUser = async () => {
        try {
            const res = await axios.get(`${server}/profile/`, { withCredentials: true });
            console.log(res);
            setUserData(res.data)

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='py-6 md:py-9 px-7 md:px-12 my-6'>


                    <div className='mb-12'>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-xl md:text-xl font-bold'>Most Popular Songs</h1>
                            <Link to="/showsong/mostpopular" className='text-lg text-[rgb(190,26,219)]'>Show all...</Link>
                        </div>

                        {
                            loading ? <span className="loader h-screen   mx-auto w-full flex justify-center items-center my-12"></span> :
                                mostPopular?.length === 0 && !loading ? <h1 className='my-8 text-center text-xl'>Songs not Available</h1> :

                                    <div className=' grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                                        {
                                            mostPopular?.slice(0, 8).map((data, index) => {
                                                return <DashCard index={index} key={index} userData={userData} data={data} handleOpenPlayer={handleOpenPlayer} />
                                            })
                                        }
                                    </div>
                        }
                    </div>





                    <div className='mb-12'>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-xl md:text-xl  font-bold'>Most Popular Videos</h1>
                            <Link to="/showvideo/mostpopular" className='text-lg text-[rgb(190,26,219)]'>Show all...</Link>
                        </div>
                        {
                            loading ? <span className="loader mx-auto w-full flex justify-center items-center my-12"></span> :
                                mostPopularVideo?.length === 0 && !loading ? <h1 className='my-8 text-xl text-center'>Videos Not Available..</h1> :

                                    <div className='grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                                        {
                                            mostPopularVideo?.slice(0, 8).map((data, index) => {
                                                return <DashCard index={index} key={index} data={data} handleOpenPlayer={handleOpenPlayer} />
                                            })
                                        }
                                    </div>
                        }
                    </div>




                </div>
            </div>
        </AppLayout>
    )
}

export default Dashboard
