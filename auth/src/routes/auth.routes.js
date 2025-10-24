import express from "express";
// import { register } from '../controllers/auth.controller'
import * as authController from "../controllers/auth.controller.js";
import * as validateRules from "../middleware/validation.middleware.js";
import passport from "passport";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.post(
  "/register",
  validateRules.registerUserValidator,
  authController.register
);
router.post("/login", validateRules.loginUserValidator, authController.login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/me", authMiddleware, authController.authMe);
router.post("/logout", authMiddleware, authController.logout);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleAuth
);

export default router;
