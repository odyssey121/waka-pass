import { fork } from 'redux-saga/effects';
import { loginWatcher } from '../component/auth/redux/sagas'


export default function* () {
    yield fork(loginWatcher);
}