import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
} from "../_actions/types";

// Reducer : 어떻게 State가 변하는거를 보여준 다음에 변환된 값을 return 해주는 것

// function(state(전 state), action(user_action.js의 return 값))
export default function (state = {}, action) {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload };
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }; // redux store에서 user -> loginSuccess(reducer return 값) -> server에서 보내준 {loginSuccess, userId}가 들어있다.
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case LOGOUT_USER:
      return { ...state };
    default:
      return state;
  }
}
