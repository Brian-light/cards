import { GOOGLEAUTH, AUTH, LOGOUT } from "../constants/actionTypes";

export default (auth = {}, action) => {
  switch (action.type) {
    case GOOGLEAUTH:
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
      return { ...action?.payload };
    case LOGOUT:
      localStorage.clear();
      return {};
    case AUTH:
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
      return { ...action?.payload };
    default:
      return auth;
  }
};
