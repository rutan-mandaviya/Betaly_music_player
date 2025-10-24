import config from "../config/config.js";
import jwt from "jsonwebtoken";

export default async function authMidllware(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      message: "No token provided!!",
    });
  try {
    const decoded = await jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error in auth midllware", error);
    res.status(401).json({
      message: "Unathorize acces!!",
    });
  }
}
