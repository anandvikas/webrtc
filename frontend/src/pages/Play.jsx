import React, { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import useWebrtc from '../hooks/useWebrtc';
import Loader from '../components/Loader/Loader';
import { useSelector } from 'react-redux';

const Play = () => {
    const { toast, roomId } = useSelector(store => store.generalReducer);
    const myVideoRef = useRef(null);
    const partnerVideoRef = useRef(null);
    const navigate = useNavigate();
    const { getRtc, getRemoteStream, getLocalStream } = useWebrtc();
    const [isPartnerJoined, setIsPartnerJoined] = useState(false);

    let peerConnection = getRtc();
    let remoteStream = getRemoteStream();
    let localStream = getLocalStream();

    const streamVideos = async () => {
        partnerVideoRef.current.srcObject = remoteStream;
        myVideoRef.current.srcObject = localStream;
    }

    useEffect(() => {
        if (!peerConnection) {
            toast.open({
                type: 'error',
                content: 'WebRTC was not configured properly!',
            });
            navigate("/")
        }
        streamVideos();
        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => {
                    if (track.readyState == 'live') {
                        track.stop();
                    }
                });
            }
        }
    }, [])

    return (
        <>
            <div className='home_div'>
                <h1>Video call</h1>
                {roomId && <h2>Connection ID - {roomId}</h2>}

                <div className='video_container'>
                    <div className="partner_video_div">
                        <video ref={partnerVideoRef} class="video-player" id="partner_video" autoPlay playsInline onPlay={() => setIsPartnerJoined(true)}></video>
                    </div>
                    <div className="my_video_div">
                        <video ref={myVideoRef} class="video-player" id="my_video" autoPlay playsInline></video>
                    </div>
                    {
                        !isPartnerJoined &&
                        <div className='loaderContainer'>
                            <Loader />
                            <p>Waiting for peer to connect...</p>
                        </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Play