import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { server } from '../service/server';
import DashCard from '../components/DashCard';
import { openPlayer } from '../redux/slices/audioPlayerSlice';
import { useDispatch } from 'react-redux';

const SongByArtist = () => {
    const [artistData, setArtistData] = useState([]);

    const { name } = useParams();
    const dispatch = useDispatch()


    const fetchArtist = async () => {
        try {
            const res = await axios.get(`${server}/content/artist/${name}`, { withCredentials: true });

            console.log(res);
            setArtistData(res.data);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchArtist()
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
                    episode: artistData
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
                <div className='py-6 md:py-9 px-7 md:px-12 my-6 mb-14'>
                    <h1 className='text-xl font-semibold'>{name.substring(0, 1).toUpperCase() + name.substring(1, name.length)}</h1>

                    {
                        artistData?.length < 1 ? (
                            <div className='w-full h-full flex items-center justify-center text-lg my-9 '>
                                No Songs Found
                            </div>
                        ) :

                            (
                                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3  md:gap-5 mt-6'>
                                    {
                                        artistData?.map((data, index) => {
                                            return <DashCard index={index} key={index} data={data} handleOpenPlayer={handleOpenPlayer} />
                                        })
                                    }
                                </div>
                            )
                    }
                </div>
            </div>
        </AppLayout>
    )
}

export default SongByArtist
