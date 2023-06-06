import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { io } from "socket.io-client";
import { setRoomId, setSocket } from '../store/action';
import useWebrtc from './useWebrtc';
import { PORT } from "../constant/api"
import { useNavigate } from "react-router-dom";



const useSocket = () => {
    const dispatch = useDispatch();
    const { socket, roomId, toast } = useSelector(store => store.generalReducer);
    const { createOffer, createAnswer, addAnswer } = useWebrtc();
    const navigate = useNavigate();


    const returnRoomIdHandler = async (data) => {
        console.log("roomId returned ...");
        const { roomId } = data;
        if (!roomId) return;
        dispatch(setRoomId(roomId));
    }

    const returnOfferHandler = async (data) => {
        console.log("offer returned ...")
        const { offer, roomId } = data;
        if (!offer) return;
        if (!socket) return;
        // console.log("offer", offer);
        const answer = await createAnswer(offer);
        // console.log("answer", answer);
        // return;
        socket.emit("sendAnswer", { roomId, answer });
        dispatch(setRoomId(roomId));
    }



    const returnAnswerHandler = async (data) => {
        console.log("answer returned ...")
        const { answer } = data;
        // console.log("answer", answer)
        if (!answer) return;
        let status = await addAnswer(answer);
        // if (status) {
        //     navigate("/play");
        // }
    }



    useEffect(() => {
        if (socket) {
            socket.on("returnRoomId", returnRoomIdHandler);
            socket.on("returnOffer", returnOfferHandler);
            socket.on("returnAnswer", returnAnswerHandler);

            return () => {
                socket.off("returnRoomId", returnRoomIdHandler);
                socket.off("returnOffer", returnOfferHandler);
                // socket.off("returnAnswer", returnAnswerHandler);
            };
        }
    }, [socket]);


    const initialise = async () => {
        let socket = await io(PORT, { transports: ["websocket"] });
        dispatch(setSocket(socket));
        return socket;
    }

    const startNew = async () => {
        // clearing previous connection ---
        // if (socket) {
        //     socket.disconnect();
        // }

        // // creating new connection ---
        // let newSocket = await initialise();

        console.log("started new...")
        if (!socket) {
            toast.open({
                type: 'error',
                content: 'Web Socket is not ready !',
            });
            return;
        };
        let offer = await createOffer();
        socket.emit("startNew", { offer });
    }

    const joinExisting = async (roomId) => {
        // // clearing previous connection ---
        // if (socket) {
        //     socket.disconnect();
        // }

        // // creating new connection ---
        // let newSocket = await initialise();
        console.log("joined existing...")
        if (!socket) {
            toast.open({
                type: 'error',
                content: 'Web Socket is not ready !',
            });
            return;
        };
        socket.emit("joinExisting", { roomId });
        // dispatch(setRoomId(roomId));
    }


    return {
        initialise,
        startNew,
        joinExisting,
    }
}

export default useSocket;