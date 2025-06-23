import authDocService from "../services/authdoc.service.js";
import jwtService from "../services/jwt.service.js";
import createError from "../utills/create-error.js";

const authenticateDoc = async (req, res, next) =>{
  try{
    const authorization = req.headers.authorization
    console.log("authorization", authorization)
    if (!authorization || !authorization.startsWith("Bearer")){
      createError(401, "Unauthorization !")
    }
    const token = authorization.split(" ")[1]
    console.log("token", token)

    if(!token) {
      createError(401, "Unauthorization !!")
    }

    const payload = jwtService.verifyTokenDoc(token)
    console.log("payload", payload)

    const doctor = await authDocService.findUserById(payload.id)
    if(!doctor) {
      createError(401, "Unauthorization !!!")
    }
    console.log("user", doctor)
    req.doctor = doctor

    next()

  } catch (error) {
    next(error)
  }

}

export default authenticateDoc