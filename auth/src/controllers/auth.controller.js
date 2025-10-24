import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import config from "../config/config.js";
import _config from "../config/config.js";
import { publicTOQueue } from "../broker/rabbit.js";

export async function register(req, res) {
  const {
    email,
    password,
    fullname: { firstname, lastname },
    role,
  } = req.body;

  const isuserExists = await userModel.findOne({ email });

  if (isuserExists) {
    return res.status(400).json({ message: "user alreadyexists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    password: hash,
    fullname: {
      firstname,
      lastname,
    },
    role,
  });

  await publicTOQueue("user_create", {
    id: user._id,
    email: user.email,
    fullname: user.fullname,
    // password: user.password,
    role: user.role,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      fullname: user.fullname,
      email: user.email,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" }
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user created succesfully",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      password: user.password,
      role: user.role,
    },
  });
}

export async function googleAuth(req, res) {
  const user = req.user;

  const isuserAlreadyExists = await userModel.findOne({
    $or: [{ email: user.emails[0].value }, { googleId: user.id }],
  });

  if (isuserAlreadyExists) {
    const token = jwt.sign(
      {
        id: isuserAlreadyExists._id,
        role: isuserAlreadyExists.role,
        fullname: isuserAlreadyExists.fullname,
        email: isuserAlreadyExists.email,
      },
      _config.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token);
    return res.redirect("http://localhost:5173");
  }

  const Newuser = await userModel.create({
    googleId: user.id,
    fullname: {
      firstname: user.name.givenName,
      lastname: user.name.familyName,
    },
    email: user.emails[0].value,
    role: "user",
  });
  const token = jwt.sign(
    {
      id: Newuser._id,
      role: Newuser.role,
      fullname: Newuser.fullname,
    },
    _config.JWT_SECRET,
    { expiresIn: "2d" }
  );
  await publicTOQueue("user_create_by_google", {
    id: Newuser._id,
    email: Newuser.email,
    fullname: Newuser.fullname,
    // password: Newuser.password,
    role: Newuser.role,
  });

  res.cookie("token", token);
  return res.redirect("http://localhost:5173");
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const ispasswordValid = await bcrypt.compare(password, user.password);
  if (!ispasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      fullname: user.fullname,
      email: user.email,
    },

    config.JWT_SECRET,
    { expiresIn: "2d" }
  );
  res.cookie("token", token);

  res.status(200).json({
    message: "user login succesfully",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      password: user.password,
      role: user.role,
    },
  });
}
export async function authMe(req, res) {
  const user = req.user;
  res.status(200).json({
    message: "user login succesfully",
    user,
  });
}
export async function logout(req, res) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(400)
        .json({ message: "No token found, user already logged out" });
    }

    // Clear the auth cookie
    res.clearCookie("token", {});

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
