import {
    SET_SOCKET,
    SET_MESSAGE_API,
    SET_ROOM_ID
} from "./actionTypes"


export const setSocket = (data) => {
    return {
        type: SET_SOCKET,
        payload: data
    }
}

export const setMessageApi = (data) => {
    return {
        type: SET_MESSAGE_API,
        payload: data
    }
}

export const setRoomId = (data) => {
    return {
        type: SET_ROOM_ID,
        payload: data
    }
}

