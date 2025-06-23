import authService from "../services/auth.service.js";
import createError from "../utills/create-error.js";
import hashService from "../services/hash.service.js";
import jwtService from "../services/jwt.service.js";
import prisma from "../config/prisma.js";

const authController = {}

authController.register = async (req, res, next) => {
  try {
    const { username, password } = req.body
    console.log("req.body",req.body)

    const exitUser = await authService.findUserByUsername(username)
    console.log("exitUser", exitUser)

    if(exitUser){
      createError(400,"already in use")
    }

    const hashPassword = hashService.hashPassword(password)
    console.log("hashPassword", hashPassword)

    const newUser = await authService.createUser({username, password:hashPassword})
    console.log("newUser", newUser)

    res.status(201).json({success: true, newUser: {id: newUser.id, username: newUser.username}})

  } catch (error) {
    next(error)
  }
}

authController.registerDoctor = async (req, res, next) => {
  try {
    const { username, password, specialization } = req.body
    console.log("req.body",req.body)

    const exitUser = await authService.findUserByUsername(username)
    console.log("exitUser", exitUser)

    if(exitUser){
      createError(400,"already in use")
    }

    const hashPassword = hashService.hashPassword(password)
    console.log("hashPassword", hashPassword)

    const newUser = await authService.createUser({username, password:hashPassword, specialization})
    console.log("newUser", newUser)

    res.status(201).json({success: true, newUser: {id: newUser.id, username: newUser.username}})

  } catch (error) {
    next(error)
  }
}

authController.login = async (req, res, next) => {
  try {
    const { username, password} = req.body
  
    const existUser = await authService.findUserByUsername(username)
      console.log("existUser:", existUser)

      if(!existUser) {
        createError(400, "Invalid user")
      }

      const isMatchPassword = hashService.comparePassword(
        password, 
        existUser.password
      )
      console.log("isMatchPassword", isMatchPassword)

      const payload = {id: existUser.id}

      const accessToken = jwtService.genAccessToken(payload)
      console.log("accessToken", accessToken)

      res.status(200).json({success: true, accessToken})
   
  } catch(error){
    next(error)
  }
}

authController.getUser = (req,res) => {
  res.status(200).json({success: true, user: req.user})
}


authController.editUser = async(req, res, next) => {
try{
const {token} = req.params
const {username} = req.body
const user = await prisma.user.update({
  where:{
    token: token
  },
  data:{
    username
  }
})
console.log(id,username)
res.json({ message: "This is update Username"})
} catch (error) {
  next(error)
}

  
}



export default authController