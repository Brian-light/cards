import React, { useState } from "react";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutLinedIcon from "@material-ui/icons/LockOutlined";
import Input from "./Input";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import Icon from "./icon";
import { useDispatch } from "react-redux";
import { getGoogleAuth } from "../../actions/auth.js";
import { useHistory } from "react-router-dom";
import { signin, signup } from "../../actions/auth.js";

import useStyles from "./styles";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const classes = useStyles();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [newGoogleUser, setNewGoogleUser] = useState({ isNew: false });
  const [flag, setFlag] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setFlag("Password mismatch, please try again.");
      } else if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(
          formData.password
        ) === false
      ) {
        setFlag(
          "Invalid password. Password must contain at least 8 characters, at least one lowercase letter, at lease one upper case letter and at least one number."
        );
      } else {
        dispatch(signup(formData, history)).then((res) => {
          if (res.status === 400) {
            setFlag(res.message);
          }
        });
      }
    } else {
      dispatch(signin(formData, history));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setNewGoogleUser({ isNew: false });
    setFlag("");
    setShowPassword(false);
  };

  const login = useGoogleLogin({
    onSuccess: (res) => googleSuccess(res),
    onError: (error) => googleFailure(error),
  });

  const googleSuccess = async (res) => {
    try {
      const result = await dispatch(getGoogleAuth(res));
      if (result) {
        setIsSignUp(true);
        setNewGoogleUser({ ...result });
        setFormData({ ...result, password: "", confirmPassword: "" });
      } else {
        history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleFailure = (error) => {
    console.log(error);
    console.log("Google sign in was unsuccessful. Try again later.");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutLinedIcon></LockOutLinedIcon>
        </Avatar>
        <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign in"}</Typography>
        {newGoogleUser.isNew && (
          <Typography variant="subtitle1">
            New google user detected, please sign up with password.
          </Typography>
        )}
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && !newGoogleUser.isNew && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />

                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            {!newGoogleUser.isNew && (
              <Input
                name="email"
                label="Email Address"
                handleChange={handleChange}
                type="email"
              ></Input>
            )}
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            ></Input>
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                type={showPassword ? "text" : "password"}
                handleChange={handleChange}
              ></Input>
            )}
          </Grid>
          {flag && (
            <Typography variant="subtitle1">
              <br />
              {flag}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          {!newGoogleUser.isNew && (
            <Button
              className={classes.googleButton}
              color="primary"
              fullWidth
              onClick={login}
              startIcon={<Icon />}
              variant="contained"
            >
              Google Sign In
            </Button>
          )}
          <Grid container justifyContent="flex-end">
            <Grid>
              <Button onClick={switchMode}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
