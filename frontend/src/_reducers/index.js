import { combineReducers } from "redux";
import user from "./user_reducer";

// user_reducer 외에도 ex) comments_reducer, lists_reducer 등을 한 번에 결합시키기 위함

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
