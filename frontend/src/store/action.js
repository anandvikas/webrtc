import {
    SET_SOCKET,
    SET_MESSAGE_API,
    SET_ROOM_ID,
    SET_LOADING
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

export const setLoading = (data) => {
    return {
        type: SET_LOADING,
        payload: data
    }
}

