import Cookies from "js-cookie";

const initialState = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "GOOGLEAUTH":
      return action.payload;
    case "LOGOUT":
      return null;
    case "VERIFY":
      return { ...state, verified: action.payload };

    default:
      return state;
  }
}
