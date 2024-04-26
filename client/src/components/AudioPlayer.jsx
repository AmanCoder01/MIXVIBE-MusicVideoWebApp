import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { server } from '../service/server';
import { BiSolidSkipPreviousCircle } from "react-icons/bi";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import styled from "styled-components";
import { closePlayer, openPlayer, setCurrentTime } from '../redux/slices/audioPlayerSlice';
import { HiVolumeUp } from "react-icons/hi";
import toast from "react-hot-toast";


const Audio = styled.audio`
    height: 42px;
    width: 100%;
    font-size: 12px;
    @media (max-width: 768px) {
        height: 40px;
        font-size: 10px;
    }
`


const VolumeBar = styled.input.attrs({
    type: 'range',
    min: 0,
    max: 1,
    step: 0.1,
})`
   
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.text_primary};
  outline: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primary};
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primary};;
    cursor: pointer;
  }
  `;

const AudioPlayer = () => {
    const [data, setData] = useState();
    const { type, currenttime, index, episode } = useSelector(state => state.audioplayer);
    const audioRef = useRef(null);
    const dispatch = useDispatch();

    const [isPlaying, setIsPlaying] = useState(false);
    const [progressWidth, setProgressWidth] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);


    const handleTimeUpdate = () => {
        const duration = audioRef.current.duration;
        const currentTime = audioRef.current.currentTime;
        const progress = (currentTime / duration) * 100;
        setProgressWidth(progress);
        setDuration(duration);
        dispatch(
            setCurrentTime({
                currenttime: currentTime
            })
        )
    }

    const goToNextPodcast = () => {
        //from the podid and index, get the next podcast
        //dispatch the next podcast
        if (episode.length === index + 1) {
            toast.error("This is the last episode");
            return
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    openPlayer: true,
                    type: "audio",
                    index: index + 1,
                    currenttime: 0,
                    episode: episode
                })
            )
        }, 10);
    }


    const goToPreviousPodcast = () => {
        //from the podid and index, get the next podcast
        //dispatch the next podcast
        if (index === 0) {
            toast.error("This is the first song");
            return;
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    openPlayer: true,
                    type: "audio",
                    index: index - 1,
                    currenttime: 0,
                    episode: episode
                })
            )
        }, 10);
    }



    const handleVolumeChange = (event) => {
        const volume = event.target.value;
        setVolume(volume);
        audioRef.current.volume = volume;
    };


    return (
        <div className='flex items-center justify-between px-1 md:px-8 w-full'>
            <div className='flex items-center gap-1  md:gap-4 w-full max-w-[7rem] text-white'>
                <img src={episode[index]?.img} alt="" height={60} width={60} />
                <p>{episode[index]?.name}</p>
            </div>

            <div className='flex items-center gap-1 md:gap-4 w-full max-w-lg'>
                <div className=''>
                    <BiSolidSkipPreviousCircle color='white' className='cursor-pointer' size={45} onClick={() => goToPreviousPodcast()} />
                </div>

                <Audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => goToNextPodcast()}
                    autoPlay
                    controls
                    onPlay={() => { audioRef.current.currentTime = currenttime }}
                    src={episode[index]?.file}
                />


                <div className=''>
                    <BiSolidSkipNextCircle color='white' className='cursor-pointer' size={45} onClick={() => goToNextPodcast()} />

                </div>
            </div>


            <div className='w-full max-w-[7rem] hidden gap-2 md:gap-4  md:flex items-center'>

                <HiVolumeUp size={29} color='white' />
                <VolumeBar value={volume} onChange={handleVolumeChange} />

            </div>

        </div>
    )
}

export default AudioPlayer
