import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { closePlayer, setCurrentTime } from '../redux/slices/audioPlayerSlice';
import { Modal } from '@mui/material';
import { IoMdCloseCircle } from "react-icons/io";




const Videoplayer = styled.video`
    height: 70%;
    max-height: 400px;
    border-radius: 16px;
    object-fit: cover;
    margin-top: 5px;
`;

const VideoPlayer = () => {
    const dispatch = useDispatch();
    const videoref = useRef(null);

    const { type, currenttime, index, episode, modalOpen } = useSelector(state => state.audioplayer);


    const handleTimeUpdate = () => {
        const currentTime = videoref.current.currentTime;
        dispatch(
            setCurrentTime({
                currenttime: currentTime
            })
        )
    }

    return (
        <div className='absolute left-0  top-[15rem] right-0 mx-auto flex justify-center items-center max-w-2xl max-h-[50vh]' open={modalOpen}>
            <div className='bg-black rounded-lg p-4 flex flex-col gap-4  text-white'>
                <div className='h-[10%] flex justify-end items-center '>
                    <IoMdCloseCircle size={40} onClick={() => dispatch(closePlayer())} />
                </div>
                <Videoplayer controls
                    ref={videoref}
                    onTimeUpdate={handleTimeUpdate}
                    // onEnded={() => goToNextPodcast()}
                    autoPlay
                    onPlay={() => { videoref.current.currentTime = currenttime }}
                >
                    <source src={episode[index]?.file} type="video/mp4" />
                    <source src={episode[index]?.file} type="video/webm" />
                    <source src={episode[index]?.file} type="video/ogg" />
                    Your browser does not support the video tag.
                </Videoplayer>

                <div className='h-[20%] px-4'>
                    <h1 className='text-xl font-semibold'>{episode[index]?.name}</h1>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
