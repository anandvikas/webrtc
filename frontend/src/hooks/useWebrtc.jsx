import React, { useState } from 'react'
import { useSelector } from 'react-redux';

let peerConnection;
let localStream;
let remoteStream;

const delay = ms => new Promise(res => setTimeout(res, ms));

const useWebrtc = () => {
    const { toast } = useSelector(store => store.generalReducer);


    const SERVERS = {
        // iceServers: [
        //     {
        //         urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        //     }
        // ]
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ]
            }
        ]
    }

    const [offer, setOffer] = useState("");
    const [answer, setAnswer] = useState("");

    const getRtc = () => {
        return peerConnection;
    }
    const getLocalStream = () => {
        return localStream;
    }
    const getRemoteStream = () => {
        return remoteStream;
    }

    let createPeerConnection = async () => {
        peerConnection = new RTCPeerConnection(SERVERS)
        remoteStream = new MediaStream();
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream)
        })
        peerConnection.ontrack = async (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            })
        }
    }

    const createOffer = async () => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        await createPeerConnection();
        let newOffer;

        const eventPromise = new Promise((res) => {
            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    setOffer(JSON.stringify(peerConnection.localDescription));
                    newOffer = peerConnection.localDescription
                }
                res(true);
            }
        })

        try {
            newOffer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(newOffer);
            setOffer(JSON.stringify(newOffer));
        } catch (err) {
            toast.open({
                type: 'error',
                content: 'Something went wrong while creating the offer.',
            });
            return
        }
        // await delay(2000);
        await eventPromise;
        return newOffer
    }

    const createAnswer = async (newOffer) => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        await createPeerConnection();

        const eventPromise = new Promise((res) => {
            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    setAnswer(JSON.stringify(peerConnection.localDescription));
                }
                res(true);
            }
        })

        if (offer) {
            newOffer = JSON.parse(offer)
        }
        if (!offer) {
            setOffer(JSON.stringify(newOffer));
        }
        if (!newOffer) {
            toast.open({
                type: 'warning',
                content: 'Please provide the offer.',
            });
            return;
        };
        let newAnswer;
        try {
            await peerConnection.setRemoteDescription(newOffer);
            newAnswer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(newAnswer);
            setAnswer(JSON.stringify(newAnswer))
        } catch (err) {
            toast.open({
                type: 'error',
                content: 'Something went wrong while generating the answer.',
            });
        }
        await eventPromise;
        return newAnswer;
    }

    const addAnswer = async (newAnswer) => {
        // newAnswer = newAnswer || answer ? JSON.parse(answer) : null;
        if (answer) {
            newAnswer = JSON.parse(answer)
        }
        if (!answer) {
            setAnswer(JSON.stringify(newAnswer))
        }
        if (!newAnswer) {
            toast.open({
                type: 'warning',
                content: 'Please provide the answer.',
            });
            return;
        }
        try {
            if (!peerConnection.currentRemoteDescription) {
                let res = await peerConnection.setRemoteDescription(newAnswer);
            }
        } catch (err) {
            toast.open({
                type: 'error',
                content: 'Something went wrong while adding the answer.',
            });
            return false
        }
        if (peerConnection.currentRemoteDescription) {
            return true
        } else {
            return false
        }
    }


    return {
        offer,
        setOffer,
        answer,
        setAnswer,
        createOffer,
        createAnswer,
        addAnswer,
        getRtc,
        getLocalStream,
        getRemoteStream,
        localStream,
        remoteStream,
    }
}

export default useWebrtc