import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const googleAuth = async (req, res) => {
  const ACCESS_TOKEN = req.headers.authorization.split(" ")[1];
  const API_KEY = process.env.API_KEY;
  const NAME_URL = `https://people.googleapis.com/v1/people/me?personFields=names&key=${API_KEY}`;
  const EMAIL_URL = `https://people.googleapis.com/v1/people/me?personFields=emailAddresses&key=${API_KEY}`;
  const PHOTO_URL = `https://people.googleapis.com/v1/people/me?personFields=photos&key=${API_KEY}`;

  try {
    const nameReq = axios.get(NAME_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    });

    const emailReq = axios.get(EMAIL_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    });

    const photoReq = axios.get(PHOTO_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    });

    const result = await axios.all([nameReq, emailReq, photoReq]);
    const firstName = result[0].data.names[0].givenName;
    const lastName = result[0].data.names[0].familyName;
    const email = result[1].data.emailAddresses[0].value;
    const photo = result[2].data.photos[0].url;
    const isUserFound = await User.findOne({ email });
    const id = isUserFound._id;

    if (isUserFound) {
      const token = jwt.sign(
        { email: result.email, id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        firstName,
        lastName,
        email,
        photo,
        id,
      });
    } else {
      res.status(200).json({
        firstName,
        lastName,
        email,
        photo,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const [firstName, lastName] = existingUser.name.split(" ");

    res.status(200).json({
      firstName,
      lastName,
      email: existingUser.email,
      token,
      photo: existingUser.photo,
      id: existingUser._id,
    });
  } catch {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, photo } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      photo,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("hi");
    res.status(200).json({ token, firstName, lastName, email });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
