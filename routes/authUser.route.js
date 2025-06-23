import express from "express";
import authControllerDoc from "../controllers/authdoc.controller.js";
import authenticateDoc from "../middlewares/authenticatedoc.middleware.js";
import validatorMiddleware from "../middlewares/validator.middleware.js";
import { schemaRegisterDoctor } from "../utills/schema-auth.js";

const authRouterDoc = express.Router()

authRouterDoc.post("/auth/register/doctor", validatorMiddleware(schemaRegisterDoctor), authControllerDoc.registerDoc)
authRouterDoc.post("/auth/login/doctor", authControllerDoc.loginDoc)
authRouterDoc.get("/doctors/me", authenticateDoc, authControllerDoc.getUser)
authRouterDoc.patch("/doctors/me", authenticateDoc, authControllerDoc.editDoc)

export default authRouterDoc