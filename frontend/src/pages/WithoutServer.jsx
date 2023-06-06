import React, { useState, Fragment, useEffect, useRef } from 'react'
import { Button, Divider, Space, Tooltip, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import useWebrtc from '../hooks/useWebrtc';
import { useSelector } from 'react-redux';

const WithoutServer = () => {
    const { toast } = useSelector(store => store.generalReducer);
    const { offer, setOffer, answer, setAnswer, createOffer, createAnswer, addAnswer, } = useWebrtc();
    const myVideoRef = useRef(null);

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isStarter, setIsStarter] = useState(null);

    const selectRole = async (isFirstToStart) => {
        setIsStarter(isFirstToStart);
        if (isFirstToStart) {
            createOffer();
        }
        setStep(2);
    }

    const handleSubmitAnswer = () => {
        let response = addAnswer();
        if (response) {
            navigate("/play");
        }
    }

    const handleGenerateAnswer = () => {
        createAnswer();
    }

    const playMyVideo = async () => {
        myVideoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    useEffect(() => {
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
            <div className='home_div'>
                <h1>Configuring the local and remote description</h1>
                <div className='wos_vid_div'><video className='wos_vid' ref={myVideoRef} autoPlay playsInline></video></div>
                {
                    step === 1 &&
                    <>
                        <p>Please select any one.</p>
                        <div className='home_btn_div'>
                            <Tooltip title="Generate an offer and add that offer in remote peer." color="#383838" >
                                <button onClick={() => selectRole(true)} className='btn_wos'>Generate Offer</button>
                            </Tooltip>
                            <Tooltip title="Add the offer generated from remote peer." color="#383838" >
                                <button onClick={() => selectRole(false)} className='btn_wos'>Add Offer</button>
                            </Tooltip>
                        </div>
                    </>
                }
                {
                    step === 2 &&
                    <>
                        {
                            isStarter ?
                                <>
                                    <p>Copy the generated offer and send it to remote peer. Then, Copy the answer received from remote peer and paste it in answer section.</p>
                                    <div className='form_container'>
                                        <div className='input_group'>
                                            <label>Offer</label><br />
                                            <textarea cols={100} rows={7} defaultValue={offer} disabled />
                                        </div>
                                        <div className='input_group'>
                                            <label>Answer (paste it below)</label><br />
                                            <textarea cols={100} rows={7} onChange={(e) => setAnswer(e.target.value)} />
                                        </div>
                                        <div className='input_group'>
                                            <button className='btn_wos' onClick={handleSubmitAnswer}>Continue</button>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <p>Paste below the offer received from remote peer. And send back the generated answer.</p>
                                    <div className='form_container'>
                                        <div className='input_group'>
                                            <label>Offer (paste it below)</label><br />
                                            <textarea cols={100} rows={7} onChange={(e) => setOffer(e.target.value)} />
                                        </div>

                                        {
                                            answer
                                                ?
                                                <>
                                                    <div className='input_group'>
                                                        <label>Answer (Send this to remote peer, then join the video call)</label><br />
                                                        <textarea cols={100} rows={7} defaultValue={answer} disabled />
                                                    </div>
                                                    <div className='input_group'>
                                                        <Popconfirm
                                                            title="Join video call"
                                                            description="Are you sure, you have send the answer to remote peer !"
                                                            onConfirm={() => { navigate("/play") }}
                                                            onCancel={() => { }}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <button className='btn_wos' >Join</button>
                                                        </Popconfirm>
                                                    </div>
                                                </>
                                                :
                                                <div className='input_group'>
                                                    <button className='btn_wos' onClick={handleGenerateAnswer}>Generate Answer</button>
                                                </div>
                                        }
                                    </div>
                                </>
                        }
                    </>


                }

            </div>
        </>
    )
}

export default WithoutServer