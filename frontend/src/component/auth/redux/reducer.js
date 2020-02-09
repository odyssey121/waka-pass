import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import * as authAction from './actions';


const initState = {
    loading: false,
    user: null,
    status: "IDLE",
    errorMessage: null
}

export const authentication = handleActions({
    [authAction.login]: (state, _payload) => {
        return { ...state, loading: true }

    },
    [authAction.getUser]: (state, _payload) => ({
        ...state, loading: true
    }),
    [authAction.getUserSuccess]: (state, { payload }) => ({
        ...state, loading: false, user: payload, status: "SUCCESS"
    }),
    [authAction.getUserFailure]: (state, { payload }) => ({
        ...state, loading: false, errorMessage: payload.message, status: "ERROR"
    }),

}, initState)


