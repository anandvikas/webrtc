import { combineReducers } from "redux";
import {
    SET_SOCKET,
    SET_MESSAGE_API,
    SET_ROOM_ID
} from "./actionTypes"

const initialState = {
    socket: null,
    toast: null,
    roomId: null
}

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SOCKET: {
            return { ...state, socket: action.payload };
        }
        case SET_MESSAGE_API: {
            return { ...state, toast: action.payload };
        }
        case SET_ROOM_ID: {
            return { ...state, roomId: action.payload }; 
        }
        default: return { ...state }
    }
}


// root reducer ------------------------------------------------------
const rootReducer = combineReducers({
    generalReducer: generalReducer,
});
export default rootReducer;