import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from "./types";
import { USER_SERVER } from "../components/Config.js";

//---------------------------------------------------------------------------------------------//registerUser

export function registerUser(dataToSubmit) {
  // server로 보냄

  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data);

  // reducer로 넘겨주는 작업
  return {
    type: REGISTER_USER,
    // payload === response(그냥 데이터 이름)
    // request === response.data (데이터)
    payload: request,
  };
}

//---------------------------------------------------------------------------------------------//loginUser

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

//---------------------------------------------------------------------------------------------//auth

export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

//---------------------------------------------------------------------------------------------//logoutUser

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
