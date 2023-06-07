import React, { useState, useEffect, useRef } from 'react'
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import useSocket from '../hooks/UseSocket';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader/Loader';

const WithServer = () => {
    const { roomId, toast, loading } = useSelector(store => store.generalReducer);
    const { startNew, joinExisting, initialise } = useSocket();
    const myVideoRef = useRef(null);

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isStarter, setIsStarter] = useState(null);
    const [connCode, setConnCode] = useState("");

    const selectRole = async (isFirstToStart) => {
        setIsStarter(isFirstToStart);
        if (isFirstToStart) {
            await startNew();
            return;
        }
        setStep(2);
    }

    const submitConnectionCode = async () => {
        if (!connCode) {
            toast.open({
                type: 'error',
                content: 'Connection code is required !',
            });
            return;
        }
        await joinExisting(connCode);
    }

    useEffect(() => {
        if (roomId) {
            navigate("/play");
        }
    }, [roomId])

    const playMyVideo = async () => {
        myVideoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    useEffect(() => {
        initialise();

        try {
            playMyVideo();
        } catch (error) {
            toast.open({
                type: 'error',
                content: 'Camera is required for this application.',
            });
            navigate("/")
        }
    }, [])
    return (
        <>
            {loading && <div className="loading_overlay"><Loader /></div>}

            <div className='home_div'>
                <h1>Start video call.</h1>
                <div className='wos_vid_div'><video className='wos_vid' ref={myVideoRef} autoPlay playsInline></video></div>
                {
                    step === 1 &&
                    <>
                        <p>Start a new video call or join an existing one.</p>
                        <div className='home_btn_div'>
                            <Tooltip title="Create a new video call." color="#383838" >
                                <button onClick={() => selectRole(true)} className='btn_wos'>Create New</button>
                            </Tooltip>
                            <Tooltip title="Join a video call by entering a connection code." color="#383838" >
                                <button onClick={() => selectRole(false)} className='btn_wos'>Join Existing</button>
                            </Tooltip>
                        </div>
                    </>
                }
                {
                    step === 2 && !isStarter &&
                    <>
                        <p>Enter the connection code below.</p>
                        <div className='form_container'>
                            <div className='input_group'>
                                <input autoFocus type="text" value={connCode} onChange={e => setConnCode(e.target.value)} />
                            </div>
                            <div className='input_group'>
                                <button className='btn_wos' onClick={submitConnectionCode}>Continue</button>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default WithServer