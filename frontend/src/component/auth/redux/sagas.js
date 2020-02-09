import { call, put, takeEvery } from 'redux-saga/effects';
import { loginRequest } from './requests';
import { login, getUserFailure, getUserSuccess } from './actions';

async function* loginSaga(action) {
    const { payload } = action;
    const response = await loginRequest(payload)
    console.log(response)
    const data = await response.json()
    console.log(data)
    try {
        getUserSuccess(data.user)

        // response.json().then(({ user }) => getUserSuccess(user))
    } catch (err) {
        console.log(err)
    }








}



export function* loginWatcher() {
    yield takeEvery(login.toString(), loginSaga);
}