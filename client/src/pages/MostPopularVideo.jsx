import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import axios from 'axios';
import { server } from '../service/server';
import DashCard from '../components/DashCard';
import { openPlayer } from '../redux/slices/audioPlayerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@mui/material';
import VideoPlayer from '../components/VideoPlayer';

const MostPopularVideo = () => {
    const [mostPopularVideo, setMostPopularVideo] = useState([]);
    const dispatch = useDispatch();
    const { openplayer, type, modalOpen } = useSelector(state => state.audioplayer);



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
                    // episode: mostPopular,
                })
            )
        } else {
            //open video player
            dispatch(
                openPlayer({
                    openPlayer: true,
                    type: "video",
                    index: index,
                    currenttime: 0,
                    episode: mostPopularVideo,
                    modalOpen: true
                })
            )
        }

    }


    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='p-6 md:p-8 my-10'>
                    <h1 className='text-2xl font-bold'>Most Popular Songs</h1>
                    <div className=' px-4 grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                        {
                            mostPopularVideo?.map((data, index) => (
                                <DashCard key={index} index={index} data={data} handleOpenPlayer={handleOpenPlayer} />
                            ))
                        }
                    </div>
                </div>



            </div>

        </AppLayout>
    )
}

export default MostPopularVideo
