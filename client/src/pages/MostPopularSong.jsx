import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import axios from 'axios';
import { server } from '../service/server';
import DashCard from '../components/DashCard';
import { openPlayer } from '../redux/slices/audioPlayerSlice';
import { useDispatch, useSelector } from 'react-redux';

const MostPopularSong = () => {
    const [mostPopular, setMostPopular] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);


    const getPopularSongs = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${server}/content/mostpopularsong`, { withCredentials: true });
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



    const getUser = async () => {
        try {
            const res = await axios.get(`${server}/profile/${user._id}`, { withCredentials: true });
            // console.log(res);
            setUserData(res.data)

        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getPopularSongs();
        getUser();
    }, [])


    const addviewtToPodcast = async (id) => {
        try {
            const res = await axios.post(`${server}/content/addview/${id}`, { withCredentials: true });

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
                    episode: mostPopular,
                })
            )
        }
    }



    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='py-6 md:py-9 px-7 md:px-12 my-6 mb-14'>
                    <h1 className='text-xl font-bold'>Most Popular Songs</h1>
                    {
                        loading ? <p className="loader    mx-auto w-full flex justify-center items-center my-12"></p> :
                            mostPopular?.length === 0 && !loading ? <h1 className='my-8 text-center text-xl'>Songs not Available</h1> :

                                <div className=' grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3  md:gap-5 mt-6'>
                                    {
                                        mostPopular?.map((data, index) => {
                                            return <DashCard index={index} key={index} userData={userData} data={data} handleOpenPlayer={handleOpenPlayer} />
                                        })
                                    }
                                </div>
                    }
                </div>

            </div>

        </AppLayout>
    )
}

export default MostPopularSong
