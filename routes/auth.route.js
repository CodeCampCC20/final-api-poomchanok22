import express from "express";
import authController from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import validatorMiddleware from "../middlewares/validator.middleware.js";
import { schemaRegister } from "../utills/schema-auth.js";

const authRouter = express.Router()

authRouter.post("/auth/register/user", validatorMiddleware(schemaRegister), authController.register)
authRouter.post("/auth/login/user", authController.login)
authRouter.get("/users/me", authenticate, authController.getUser)
authRouter.patch("/users/me", authenticate, authController.editUser)

authRouter.post("/health-records", authenticate, authController.createHealthRecord)
authRouter.get("/health-records", authenticate, authController.getRecord)
authRouter.get("/health-records/:id", authenticate, authController.getRecordById)
authRouter.patch("/health-records/:id", authenticate, authController.editRecordById)
authRouter.delete("/health-records/:id", authenticate, authController.deleteRecordById)


export default authRouter