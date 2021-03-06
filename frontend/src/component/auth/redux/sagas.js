import { call, put, takeEvery } from "redux-saga/effects";
import { loginRequest, profileRequest } from "./requests";
import {
  login,
  setUser,
  resetUser,
  loginSuccess,
  loginFailure,
  restoreProfile,
  restoreProfileSuccess,
  restoreProfileFailure,
  logout
} from "./actions";

const responseMessage = {
  401: "Неверный логин или api-key",
  406: "К сожалению вы не можете войти в систему - т.к вы еще не наработали и минуты"
};

function* loginSaga(action) {
  const { payload } = action;
  const response = yield call(loginRequest, payload);
  if (response.status === 200) {
    const data = yield call([response, "json"]);
    const { token } = data.user;
    const { user } = data;
    yield put(setUser(user));
    localStorage.setItem("wakav1.0-token", `${user.id} ${token}`);
    yield put(loginSuccess());
  } else {
    yield put(loginFailure(responseMessage[response.status]));
  }
}

function* logoutSaga(_action) {
  localStorage.removeItem("wakav1.0-token");
  yield put(resetUser());
}

function* restoreProfileSaga(_action) {
  const token = localStorage.getItem("wakav1.0-token");
  if (token) {
    const response = yield call(profileRequest, token);
    const data = yield call([response, "json"]);
    const { user } = data;
    if (user) {
      yield put(setUser(user));
      yield put(restoreProfileSuccess());
    } else if (data.error) {
      localStorage.removeItem("wakav1.0-token");
      yield put(restoreProfileFailure(data.error));
    }
  } else {
    yield put(restoreProfileFailure());
  }
}

export function* loginWatcher() {
  yield takeEvery(login.toString(), loginSaga);
  yield takeEvery(logout.toString(), logoutSaga);
  yield takeEvery(restoreProfile.toString(), restoreProfileSaga);
}
