import * as api from "../api";
import { GOOGLEAUTH, AUTH } from "../constants/actionTypes";
// action creators

export const getGoogleAuth = (res) => async (dispatch) => {
  try {
    const { data } = await api.googleAuth(res);

    if (data.token) {
      dispatch({ type: GOOGLEAUTH, payload: data });
    } else {
      return { ...data, isNew: true };
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const signin = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, payload: data });

    history.push("/");
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, history) => async (dispatch) => {
  try {
    const response = await api.signUp(formData);
    dispatch({ type: AUTH, payload: response.data });
    history.push("/");
  } catch (error) {
    if (error.response.status === 400) {
      return {
        status: 400,
        message: "Your email address is already registered. Please try again.",
      };
    } else {
      console.log(error);
    }
  }
};
